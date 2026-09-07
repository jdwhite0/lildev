import * as THREE from 'three';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { LightProbeGrid } from 'three/addons/lighting/LightProbeGrid.js';
import { LightProbeGridHelper } from 'three/addons/helpers/LightProbeGridHelper.js';
import { createWorldSettings, createWorld, addBroadphaseLayer, addObjectLayer, enableCollision, registerAll, updateWorld, rigidBody, box, MotionType } from 'crashcat';
import { Vehicle, MAX_SPEED } from './Vehicle.js';
import { Camera } from './Camera.js';
import { Controls } from './Controls.js';
import { buildTrack, decodeCells, computeSpawnPosition, computeTrackBounds } from './Track.js';
import { buildWallColliders, createSphereBody } from './Physics.js';
import { SmokeTrails } from './Particles.js';
import { DriftMarks } from './DriftMarks.js';
import { GameAudio } from './Audio.js';
import { LapTimer } from './LapTimer.js';
import { ColorMapGLTFLoader } from './Loader.js';
import { CARS } from './cars.js';
import { TRACKS, getTrack } from './tracks.js';
import { Race } from './Race.js';
import { getCarModel } from './carModels.js';


const renderer = new THREE.WebGLRenderer( { antialias: true, outputBufferType: THREE.HalfFloatType } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 1.5 ) ); // clamp: retina was rendering 4x pixels
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ) );
bloomPass.strength = 0.02;
bloomPass.radius = 0.02;
bloomPass.threshold = 0.5;

renderer.setEffects( [] ); // bloom disabled (was strength 0.02 — invisible, still cost a full-screen pass)

document.body.appendChild( renderer.domElement );

// Adaptive resolution — scale render res to hold a smooth framerate.
const MAX_RES = Math.min( window.devicePixelRatio, 1.5 );
let _resScale = MAX_RES, _resFrames = 0, _resT0 = performance.now();

const scene = new THREE.Scene();
// Lil Dev World sky — soft cartoon blue (was 0xadb2ba grey)
scene.background = new THREE.Color( 0xbfe3ff );
scene.fog = new THREE.Fog( 0xbfe3ff, 30, 55 );

const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
dirLight.position.set( 11.4, 15, -5.3 );
dirLight.castShadow = true;
dirLight.shadow.mapSize.setScalar( 2048 ); // was 4096 (16.7M texels/frame)
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 60;
dirLight.shadow.radius = 4;
scene.add( dirLight );

const hemiLight = new THREE.HemisphereLight( 0xc8d8e8, 0x7a8a5a, 2 );
hemiLight.position.copy( dirLight.position )
scene.add( hemiLight );


window.addEventListener( 'resize', () => {

	renderer.setSize( window.innerWidth, window.innerHeight );

} );

const loader = new ColorMapGLTFLoader();

const modelNames = [
	'vehicle-truck-yellow', 'vehicle-truck-green', 'vehicle-truck-purple', 'vehicle-truck-red',
	'track-straight', 'track-corner', 'track-bump', 'track-finish',
	'decoration-empty', 'decoration-forest', 'decoration-tents',
];

const models = {};

async function loadModels() {

	let _loaded = 0;
	const promises = modelNames.map( ( name ) =>
		new Promise( ( resolve, reject ) => {

			loader.load( `models/${ name }.glb`, ( gltf ) => {

				const meshes = [];
				gltf.scene.traverse( ( child ) => {

					if ( child.isMesh ) {

						child.material.side = THREE.FrontSide;
						meshes.push( child );

					}

				} );

				// Godot imports vehicle models at root_scale=0.5
				if ( name.startsWith( 'vehicle-' ) ) {

					gltf.scene.scale.setScalar( 0.5 );

				}

				if ( meshes.length === 1 ) {

					const mesh = meshes[ 0 ];
					mesh.removeFromParent();
					models[ name ] = mesh;

				} else {

					models[ name ] = gltf.scene;

				}

				_loaded ++;
				window.dispatchEvent( new CustomEvent( 'racer-progress', { detail: _loaded / modelNames.length } ) );
				resolve();

			}, undefined, reject );

		} )
	);

	await Promise.all( promises );

}

async function init() {

	registerAll();
	await loadModels();

	// Signal the Lil Dev Racer start screen that the game is ready to play.
	window.dispatchEvent( new Event( 'lildev-racer-ready' ) );

	const mapParam = new URLSearchParams( window.location.search ).get( 'map' );
	let customCells = null;
	let spawn = null;

	if ( mapParam ) {

		try {

			customCells = decodeCells( mapParam );
			spawn = computeSpawnPosition( customCells );

		} catch ( e ) {

			console.warn( 'Invalid map parameter, using default track' );

		}

	}

	// ---- Venture track selection (?track=<id> or saved choice) ----
	const _trackId = new URLSearchParams( window.location.search ).get( 'track' )
		|| localStorage.getItem( 'jdRacerTrack' );
	const trackDef = getTrack( _trackId );
	if ( ! customCells && trackDef && trackDef.cells ) {

		customCells = trackDef.cells;
		spawn = computeSpawnPosition( customCells );

	}
	if ( trackDef ) {

		scene.background.setHex( trackDef.sky );
		scene.fog.color.setHex( trackDef.fog );

	}

	// Compute track bounds and size physics/shadows to fit
	const bounds = computeTrackBounds( customCells );
	const hw = bounds.halfWidth;
	const hd = bounds.halfDepth;
	const groundSize = Math.max( hw, hd ) * 2 + 20;

	const shadowExtent = Math.max( hw, hd ) + 10;
	dirLight.shadow.camera.left = - shadowExtent;
	dirLight.shadow.camera.right = shadowExtent;
	dirLight.shadow.camera.top = shadowExtent;
	dirLight.shadow.camera.bottom = - shadowExtent;
	dirLight.shadow.camera.updateProjectionMatrix();

	scene.fog.near = groundSize * 0.4;
	scene.fog.far = groundSize * 0.8;

	buildTrack( scene, models, customCells );

	// ---- Venture theming: tint the track, lay themed ground, recolor the light ----
	if ( trackDef ) {

		if ( trackDef.tint != null ) {
			const _tt = new THREE.Color( trackDef.tint );
			scene.traverse( o => {
				if ( o.isMesh && o.material && o.material.color ) {
					o.material = o.material.clone();
					o.material.color.multiply( _tt );
				}
			} );
		}
		if ( trackDef.ground != null ) {
			const g = new THREE.Mesh(
				new THREE.CircleGeometry( groundSize * 0.75, 48 ),
				new THREE.MeshStandardMaterial( { color: trackDef.ground, roughness: 1 } ) );
			g.rotation.x = - Math.PI / 2;
			g.position.set( bounds.centerX, - 0.11, bounds.centerZ );
			g.receiveShadow = true;
			scene.add( g );
		}
		if ( trackDef.hemi != null ) hemiLight.color.setHex( trackDef.hemi );
		if ( trackDef.sun != null ) dirLight.color.setHex( trackDef.sun );

	}

	// Probes

	const probeHeight = 6;
	const probes = new LightProbeGrid(
		hw * 2, probeHeight, hd * 2,
		Math.max( 4, Math.round( hw / 4 ) ),
		2,
		Math.max( 4, Math.round( hd / 4 ) ),
	);
	probes.position.set( bounds.centerX, probeHeight / 2, bounds.centerZ );
	probes.bake( renderer, scene, { cubemapSize: 32, near: 0.1, far: groundSize } );
	scene.add( probes );

	// scene.add( new LightProbeGridHelper( probes, 0.5 ) );

	//

	const worldSettings = createWorldSettings();
	worldSettings.gravity = [ 0, - 9.81, 0 ];

	const BPL_MOVING = addBroadphaseLayer( worldSettings );
	const BPL_STATIC = addBroadphaseLayer( worldSettings );
	const OL_MOVING = addObjectLayer( worldSettings, BPL_MOVING );
	const OL_STATIC = addObjectLayer( worldSettings, BPL_STATIC );

	enableCollision( worldSettings, OL_MOVING, OL_STATIC );
	enableCollision( worldSettings, OL_MOVING, OL_MOVING );

	const world = createWorld( worldSettings );
	world._OL_MOVING = OL_MOVING;
	world._OL_STATIC = OL_STATIC;

	buildWallColliders( world, null, customCells );

	const roadHalf = groundSize / 2;
	rigidBody.create( world, {
		shape: box.create( { halfExtents: [ roadHalf, 0.01, roadHalf ] } ),
		motionType: MotionType.STATIC,
		objectLayer: OL_STATIC,
		position: [ bounds.centerX, - 0.125, bounds.centerZ ],
		friction: 5.0,
		restitution: 0.0,
	} );

	const sphereBody = createSphereBody( world, spawn ? spawn.position : null );

	const vehicle = new Vehicle();
	vehicle.rigidBody = sphereBody;
	vehicle.physicsWorld = world;

	if ( spawn ) {

		const [ sx, sy, sz ] = spawn.position;
		vehicle.spherePos.set( sx, sy, sz );
		vehicle.prevModelPos.set( sx, 0, sz );
		vehicle.container.rotation.y = spawn.angle;

	}

	// ---- Load the car the player selected in the Garage ----
	const _carId = new URLSearchParams( window.location.search ).get( 'car' )
		|| localStorage.getItem( 'jdRacerSelectedCar' );
	const car = CARS.find( c => c.id === _carId ) || CARS[ 0 ];
	const _carModel = getCarModel( car, models ); // real archetype model — same one shown in the garage
	const vehicleGroup = vehicle.init( _carModel, { speedMul: car.speed || 1, accelMul: car.accel || 1, gripMul: car.grip || 1 } );
	scene.add( vehicleGroup );

	dirLight.target = vehicleGroup;

	const cam = new Camera();
	scene.add( cam.debug );

	const controls = new Controls();

	const particles = new SmokeTrails( scene );
	const driftMarks = new DriftMarks( scene, mapParam );

	const audio = new GameAudio();
	audio.init( cam.camera );

	const lapTimer = new LapTimer( customCells, mapParam || ( trackDef && trackDef.id ) );

	// ---- Race mode: 3 laps, AI opponents, items, coins ----
	const race = new Race( {
		scene, models, vehicle, lapTimer,
		cells: customCells || undefined,
		trackId: ( trackDef && trackDef.id ) || 'classic',
		theme: 'lildev',
		playerCarId: car.id,
		coinLabel: 'coins',
	} );

	const _forward = new THREE.Vector3();
	const _camLead = new THREE.Vector3();

	const contactListener = {
		onContactAdded( bodyA, bodyB ) {

			if ( bodyA !== sphereBody && bodyB !== sphereBody ) return;

			_forward.set( 0, 0, 1 ).applyQuaternion( vehicle.container.quaternion );
			_forward.y = 0;
			_forward.normalize();

			const impactVelocity = Math.abs( vehicle.modelVelocity.dot( _forward ) );
			audio.playImpact( impactVelocity );

		}
	};

	const timer = new THREE.Timer();

	function animate() {

		requestAnimationFrame( animate );
		if ( document.hidden ) return; // pause when tab hidden

		timer.update();
		const dt = Math.min( timer.getDelta(), 1 / 30 );

		_resFrames++;
		const _now = performance.now();
		if ( _now - _resT0 >= 500 ) {
			const fps = _resFrames * 1000 / ( _now - _resT0 );
			if ( fps < 50 && _resScale > 0.7 ) { _resScale = Math.max( 0.7, _resScale - 0.1 ); renderer.setPixelRatio( _resScale ); }
			else if ( fps > 58 && _resScale < MAX_RES ) { _resScale = Math.min( MAX_RES, _resScale + 0.1 ); renderer.setPixelRatio( _resScale ); }
			_resFrames = 0; _resT0 = _now;
		}

		// paused: keep rendering the scene, freeze the world
		if ( race.paused ) { renderer.render( scene, cam.camera ); return; }

		// countdown: nobody moves before GO — player included
		const input = race.started ? controls.update() : { x: 0, z: 0, touchActive: false };

		updateWorld( world, contactListener, dt );

		vehicle.update( dt, input );

		dirLight.position.set(
			vehicle.spherePos.x + 11.4,
			15,
			vehicle.spherePos.z - 5.3
		);

		const mv = vehicle.modelVelocity;
		_camLead.set( 0, 0, 1 ).applyQuaternion( vehicle.container.quaternion ).multiplyScalar( Math.sqrt( mv.x * mv.x + mv.z * mv.z ) );
		cam.update( dt, vehicle.spherePos, _camLead );
		particles.update( dt, vehicle );
		driftMarks.update( dt, vehicle );
		audio.update( dt, vehicle.linearSpeed / MAX_SPEED, input.z, vehicle.driftIntensity );

		const hasInput = input.touchActive || Math.abs( input.x ) > 0.05 || Math.abs( input.z ) > 0.05;
		lapTimer.update( dt, vehicle.spherePos, hasInput );
		race.update( dt, input );

		renderer.render( scene, cam.camera );

	}

	animate();

}

init();

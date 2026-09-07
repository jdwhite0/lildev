// preview.js — real 3D car previews for the Garage/Market.
// makeThumbs(): renders each car's actual model to a PNG data-URL (card art).
// CarViewer:    live rotating turntable of the selected car.
import * as THREE from 'three';
import { ColorMapGLTFLoader } from './Loader.js';
import { CARS } from './cars.js';
import { getCarModel } from './carModels.js';

const loader = new ColorMapGLTFLoader();
const modelCache = {};

async function loadModel( name ) {

	if ( modelCache[ name ] ) return modelCache[ name ];
	modelCache[ name ] = new Promise( ( resolve, reject ) => {
		loader.load( `models/${ name }.glb`, ( gltf ) => {
			gltf.scene.traverse( c => { if ( c.isMesh ) c.material.side = THREE.FrontSide; } );
			gltf.scene.scale.setScalar( 0.5 ); // kit vehicles import at 0.5
			resolve( gltf.scene );
		}, undefined, reject );
	} );
	return modelCache[ name ];

}

function tinted( base, color ) {

	const m = base.clone( true );
	if ( color != null ) {
		const tint = new THREE.Color( color );
		m.traverse( o => {
			if ( o.isMesh && ! /wheel|tyre|tire|glass|window|light|lamp/i.test( o.name ) ) {
				o.material = o.material.clone();
				if ( o.material.color ) o.material.color.copy( tint );
			}
		} );
	}
	return m;

}

function studio( w, h ) {

	const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true, preserveDrawingBuffer: true } );
	renderer.setSize( w, h );
	renderer.setPixelRatio( 1.5 );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 32, w / h, 0.1, 50 );
	camera.position.set( 2.6, 1.6, 3.2 );
	camera.lookAt( 0, 0.4, 0 );

	scene.add( new THREE.HemisphereLight( 0xffffff, 0x334, 1.4 ) );
	const key = new THREE.DirectionalLight( 0xffffff, 2.2 ); key.position.set( 3, 5, 4 ); scene.add( key );
	const rim = new THREE.DirectionalLight( 0x88aaff, 1.0 ); rim.position.set( - 4, 2, - 3 ); scene.add( rim );

	return { renderer, scene, camera };

}

// Render every car in CARS to a data-URL thumbnail. Returns Map<carId, dataURL>.
export async function makeThumbs( w = 300, h = 180 ) {

	const { renderer, scene, camera } = studio( w, h );
	const thumbs = new Map();

	for ( const car of CARS ) {

		try {

			const m = car.build ? getCarModel( car ) : tinted( await loadModel( car.model ), car.color );
			scene.add( m );
			renderer.render( scene, camera );
			thumbs.set( car.id, renderer.domElement.toDataURL( 'image/png' ) );
			scene.remove( m );

		} catch ( e ) { /* leave missing — card falls back to emoji */ }

	}

	renderer.dispose();
	return thumbs;

}

// Live rotating turntable inside a given container element.
export class CarViewer {

	constructor( container, h = 200 ) {

		const w = container.clientWidth || 320;
		const s = studio( w, h );
		this.renderer = s.renderer; this.scene = s.scene; this.camera = s.camera;
		this.renderer.domElement.style.width = '100%';
		this.renderer.domElement.style.height = h + 'px';
		container.appendChild( this.renderer.domElement );
		this.current = null;
		this._running = true;

		const tick = () => {
			if ( ! this._running ) return;
			requestAnimationFrame( tick );
			if ( document.hidden ) return;
			if ( this.current ) this.current.rotation.y += 0.012;
			this.renderer.render( this.scene, this.camera );
		};
		tick();

	}

	async show( car ) {

		try {

			const m = car.build ? getCarModel( car ) : tinted( await loadModel( car.model ), car.color );
			if ( this.current ) this.scene.remove( this.current );
			this.current = m;
			this.scene.add( m );

		} catch ( e ) { /* model missing — keep previous */ }

	}

	dispose() { this._running = false; this.renderer.dispose(); }

}

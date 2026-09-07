// Race.js — 3-lap race mode: AI opponents, item boxes, coin pickups, Mario-Kart-style HUD,
// race records. Self-contained (injects its own HUD + styles), themed per game.
import * as THREE from 'three';
import { CELL_RAW, GRID_SCALE, computeSpawnPosition, TRACK_CELLS } from './Track.js';
import { CARS, addCoins } from './cars.js';
import { getCarModel } from './carModels.js';
import { Sfx } from './Sfx.js';
import { MAX_SPEED } from './Vehicle.js';

const CELL = CELL_RAW * GRID_SCALE;
const TOTAL_LAPS = 3;
const AI_COUNT = 2;
const BEST_PREFIX = 'jdRacer.bestRace3.';

// Walk the track cells as a graph to get an ordered centerline loop (works on ANY track).
function buildLoop( cells ) {

	const key = ( x, z ) => x + ',' + z;
	const set = new Set( cells.map( c => key( c[ 0 ], c[ 1 ] ) ) );
	const start = cells.find( c => c[ 2 ] === 'track-finish' ) || cells[ 0 ];
	const loop = [];
	const visited = new Set();
	let cur = [ start[ 0 ], start[ 1 ] ];

	while ( true ) {

		loop.push( [ cur[ 0 ], cur[ 1 ] ] );
		visited.add( key( cur[ 0 ], cur[ 1 ] ) );
		const next = [ [ 1, 0 ], [ - 1, 0 ], [ 0, 1 ], [ 0, - 1 ] ]
			.map( d => [ cur[ 0 ] + d[ 0 ], cur[ 1 ] + d[ 1 ] ] )
			.find( p => set.has( key( p[ 0 ], p[ 1 ] ) ) && ! visited.has( key( p[ 0 ], p[ 1 ] ) ) );
		if ( ! next ) break;
		cur = next;

	}

	return loop;

}

const ITEMS = [
	{ id: 'boost', name: 'Turbo', icon: '🍄' },   // instant kick + higher top speed
	{ id: 'star', name: 'Star', icon: '⭐' },     // long boost + AIs back off
	{ id: 'zap', name: 'Zap', icon: '⚡' },       // both AIs spin out + crawl
	{ id: 'shell', name: 'Shell', icon: '🐢' },   // freezes the racer ahead of you
];

const ORD = [ '1st', '2nd', '3rd', '4th' ];

function fmt( t ) {
	if ( t == null || ! isFinite( t ) ) return '--:--.--';
	const m = Math.floor( t / 60 ), s = t - m * 60;
	return `${ m }:${ s.toFixed( 2 ).padStart( 5, '0' ) }`;
}

export class Race {

	constructor( { scene, models, vehicle, lapTimer, cells = null, trackId = 'classic', theme = 'lildev', playerCarId = null, coinLabel = 'coins' } ) {

		this.scene = scene;
		this.vehicle = vehicle;
		this.lapTimer = lapTimer;
		this.theme = theme;
		this.coinLabel = coinLabel;
		this.bestKey = BEST_PREFIX + trackId;

		// ---- Path (closed Catmull-Rom through cell centers, oriented to spawn direction) ----
		const trackCells = cells || TRACK_CELLS;
		const spawn = computeSpawnPosition( trackCells );
		let pts = buildLoop( trackCells ).map( ( [ gx, gz ] ) => new THREE.Vector3( gx * CELL, 0, gz * CELL ) );
		const fwd = new THREE.Vector3( Math.sin( spawn.angle ), 0, Math.cos( spawn.angle ) );
		const d0 = pts[ 1 ].clone().sub( pts[ 0 ] ).normalize();
		if ( fwd.dot( d0 ) < 0 ) { pts = [ pts[ 0 ], ...pts.slice( 1 ).reverse() ]; }
		this.curve = new THREE.CatmullRomCurve3( pts, true, 'centripetal' );
		this.curveLen = this.curve.getLength();
		this.samples = this.curve.getSpacedPoints( 240 );

		// ---- State ----
		this.started = false;
		this.finished = false;
		this.raceTime = 0;
		this.playerIdx = 0;            // nearest sample index (progress tracker)
		this.playerLaps = 0;           // completed laps (from lapTimer)
		this.coins = 0;
		this.heldItem = null;
		this.effects = { boostT: 0, starT: 0, zapT: 0 };
		this.playerSpeed = 0;      // measured player speed (used only to calibrate difficulty)
		this.topSpeedEst = 12.5;   // world units/s — learned upward from the player's real pace
		this.paused = false;
		this.driftCharge = 0;      // hold a hard turn at speed, release for a mini-boost
		this.wrongT = 0;           // wrong-way accumulator
		this.prevLapShown = 1;
		this.baseSpeedMul = vehicle.speedMul || 1;

		this._buildAI( models, playerCarId );
		this._buildPickups();
		this._buildHUD();
		this._bindInput();
		this._countdown();

	}

	// ================= AI RACERS =================
	_buildAI( models, playerCarId ) {

		this.ais = [];
		const pool = CARS.filter( c => c.id !== playerCarId );
		for ( let i = 0; i < AI_COUNT; i ++ ) {

			const spec = pool.splice( Math.floor( Math.random() * pool.length ), 1 )[ 0 ] || CARS[ 0 ];
			const mesh = getCarModel( spec, models ); // same real model the player sees in the garage
			const group = new THREE.Group();
			group.add( mesh );
			// floating name tag so you know who you're racing
			const cv = document.createElement( 'canvas' ); cv.width = 256; cv.height = 64;
			const cx = cv.getContext( '2d' );
			cx.font = '700 34px Nunito, monospace'; cx.textAlign = 'center';
			cx.fillStyle = '#fff'; cx.strokeStyle = 'rgba(0,0,0,.8)'; cx.lineWidth = 6;
			cx.strokeText( spec.name, 128, 42 ); cx.fillText( spec.name, 128, 42 );
			const tag = new THREE.Sprite( new THREE.SpriteMaterial( { map: new THREE.CanvasTexture( cv ), depthTest: false } ) );
			tag.scale.set( 1.7, 0.42, 1 ); tag.position.y = 1.55;
			group.add( tag );
			this.scene.add( group );

			const ai = {
				spec, group,
				u: 1 - ( i + 1 ) * 0.012,               // staggered just behind the line
				laps: 0,
				lateral: ( i === 0 ? - 0.7 : 0.7 ),      // stays inside the road width
				paceMul: 0.9 + ( ( spec.speed || 1 ) - 1 ) * 0.3 + Math.random() * 0.08,
				speed: 0,                 // real CPUs launch from a standstill and accelerate
				spinT: 0, freezeT: 0,
				jitterT: Math.random() * 10,
			};
			this._placeAI( ai );
			this.ais.push( ai );

		}

	}

	_placeAI( ai ) {

		const p = this.curve.getPointAt( ai.u );
		const t = this.curve.getTangentAt( ai.u );
		const n = new THREE.Vector3( - t.z, 0, t.x );
		ai.group.position.copy( p ).addScaledVector( n, ai.lateral );
		ai.group.position.y = 0;
		const look = ai.group.position.clone().add( t );
		ai.group.lookAt( look );

	}

	// ================= PICKUPS =================
	_buildPickups() {

		this.itemBoxes = [];
		this.coinMeshes = [];

		// Item boxes — fixed spots on the racing line (Mario-Kart style rows of 2)
		const boxGeo = new THREE.BoxGeometry( 0.9, 0.9, 0.9 );
		for ( const u of [ 0.16, 0.38, 0.62, 0.85 ] ) {
			for ( const lat of [ - 1.2, 1.2 ] ) {
				const mat = new THREE.MeshStandardMaterial( {
					color: 0xffffff, metalness: 0.3, roughness: 0.15,
					transparent: true, opacity: 0.85,
					emissive: 0x8855ff, emissiveIntensity: 0.55,
				} );
				const m = new THREE.Mesh( boxGeo, mat );
				const p = this.curve.getPointAt( u );
				const t = this.curve.getTangentAt( u );
				const n = new THREE.Vector3( - t.z, 0, t.x );
				m.position.copy( p ).addScaledVector( n, lat );
				m.position.y = 0.8;
				this.scene.add( m );
				this.itemBoxes.push( { mesh: m, active: true, respawn: 0 } );
			}
		}

		// Coins — clusters of 3 along the tangent at fixed spots
		const coinGeo = new THREE.CylinderGeometry( 0.34, 0.34, 0.08, 20 );
		const coinMat = new THREE.MeshStandardMaterial( {
			color: 0xffc20e, metalness: 0.85, roughness: 0.25,
			emissive: 0xffc20e, emissiveIntensity: 0.35,
		} );
		for ( const u of [ 0.08, 0.24, 0.32, 0.48, 0.56, 0.7, 0.78, 0.94 ] ) {
			for ( let k = - 1; k <= 1; k ++ ) {
				const uu = ( u + k * 0.012 + 1 ) % 1;
				const p = this.curve.getPointAt( uu );
				const m = new THREE.Mesh( coinGeo, coinMat );
				m.rotation.x = Math.PI / 2;
				m.position.copy( p );
				m.position.y = 0.65;
				this.scene.add( m );
				this.coinMeshes.push( { mesh: m, taken: false } );
			}
		}

	}

	// ================= HUD =================
	_buildHUD() {

		const jdp = this.theme === 'jdp';
		const font = jdp
			? "'Press Start 2P', monospace"
			: "'Fredoka', 'Nunito', sans-serif";
		const panel = jdp
			? 'background:#0a0c1c; border:3px solid #00e5cc; border-radius:4px; box-shadow:4px 4px 0 #000;'
			: 'background:rgba(26,35,64,.85); border:2.5px solid rgba(255,255,255,.25); border-radius:16px; backdrop-filter:blur(10px);';
		const fs = jdp ? '10px' : '14px';
		const fsBig = jdp ? '26px' : '44px';

		const style = document.createElement( 'style' );
		style.textContent = `
			#lap-timer { display:none !important; }
			.rk { position:fixed; z-index:22; color:#fff; font-family:${ font }; ${ panel } padding:10px 14px; pointer-events:none; }
			.rk small { opacity:.65; font-size:${ jdp ? '7px' : '11px' }; letter-spacing:.08em; text-transform:uppercase; display:block; margin-bottom:4px; }
			#rk-item { top:14px; left:50%; transform:translateX(-50%); width:${ jdp ? '64px' : '76px' }; height:${ jdp ? '64px' : '76px' };
				display:flex; align-items:center; justify-content:center; font-size:${ jdp ? '30px' : '40px' }; padding:0; }
			#rk-pos { bottom:16px; left:16px; font-size:${ fsBig }; font-weight:800; line-height:1; padding:14px 18px; }
			#rk-lap { top:14px; right:14px; font-size:${ fs }; text-align:right; }
			#rk-lap b { font-size:${ jdp ? '16px' : '24px' }; }
			#rk-coins { bottom:16px; right:16px; font-size:${ fs }; display:flex; align-items:center; gap:8px; }
			#rk-coins b { font-size:${ jdp ? '16px' : '22px' }; color:#ffc20e; }
			#rk-time { top:${ jdp ? '96px' : '110px' }; right:14px; font-size:${ fs }; text-align:right; }
			#rk-center { position:fixed; z-index:24; top:38%; left:50%; transform:translate(-50%,-50%); text-align:center;
				font-family:${ font }; color:#fff; font-size:${ jdp ? '34px' : '64px' }; font-weight:800;
				text-shadow:${ jdp ? '4px 4px 0 #000' : '0 6px 30px rgba(0,0,0,.6)' }; pointer-events:none; }
			#rk-results { position:fixed; inset:0; z-index:40; display:none; align-items:center; justify-content:center;
				background:rgba(2,3,10,.82); font-family:${ font }; }
			#rk-results .card { ${ panel } color:#fff; text-align:center; padding:2rem 2.6rem; max-width:400px; pointer-events:auto; }
			#rk-results h2 { font-size:${ jdp ? '20px' : '38px' }; margin:0 0 .8rem; }
			#rk-results .line { font-size:${ jdp ? '9px' : '15px' }; margin:.45rem 0; opacity:.85; }
			#rk-results .rec { color:#ffc20e; font-size:${ jdp ? '10px' : '16px' }; margin:.6rem 0; }
			#rk-results button { font-family:${ font }; font-size:${ jdp ? '10px' : '16px' }; font-weight:700; border:none; cursor:pointer;
				border-radius:999px; padding:.8rem 1.6rem; margin:.9rem .3rem 0; }
			#rk-hint { position:fixed; z-index:22; bottom:16px; left:50%; transform:translateX(-50%); font-family:${ font };
				font-size:${ jdp ? '7px' : '11px' }; color:rgba(255,255,255,.55); pointer-events:none; }
			#rk-item.hold { cursor:pointer; animation:rkpulse 0.9s infinite; border-color:#ffc20e !important; }
			@keyframes rkpulse { 0%,100% { box-shadow:0 0 0 0 rgba(255,194,14,.75); } 50% { box-shadow:0 0 0 12px rgba(255,194,14,0); } }
			#rk-map { position:fixed; z-index:22; left:16px; top:16px; width:132px; height:132px; pointer-events:none;
				background:rgba(6,8,20,.55); border-radius:14px; backdrop-filter:blur(6px); border:1px solid rgba(255,255,255,.15); }
			#rk-banner { position:fixed; z-index:26; top:24%; left:50%; transform:translate(-50%,-50%) scale(0); text-align:center;
				font-family:${ font }; font-weight:800; color:#ffc20e; font-size:${ jdp ? '22px' : '46px' };
				text-shadow:${ jdp ? '3px 3px 0 #000' : '0 4px 22px rgba(0,0,0,.6)' }; pointer-events:none;
				transition:transform .25s cubic-bezier(.2,1.6,.4,1); }
			#rk-banner.show { transform:translate(-50%,-50%) scale(1); }
			#rk-pause { position:fixed; inset:0; z-index:45; display:none; align-items:center; justify-content:center;
				background:rgba(2,3,10,.75); font-family:${ font }; }
			#rk-pause .card { ${ panel } color:#fff; text-align:center; padding:1.8rem 2.4rem; pointer-events:auto; }
			#rk-pause h2 { font-size:${ jdp ? '16px' : '30px' }; margin:0 0 1rem; }
			#rk-pause button { display:block; width:100%; font-family:${ font }; font-size:${ jdp ? '9px' : '15px' }; font-weight:700;
				border:none; cursor:pointer; border-radius:999px; padding:.7rem 1.5rem; margin:.45rem 0; }
		`;
		document.head.appendChild( style );

		const mk = ( id, html ) => {
			const el = document.createElement( 'div' );
			el.id = id; el.innerHTML = html;
			document.body.appendChild( el );
			return el;
		};

		this.elItem = mk( 'rk-item', '—' ); this.elItem.className = 'rk';
		this.elPos = mk( 'rk-pos', '1st' ); this.elPos.className = 'rk';
		this.elLap = mk( 'rk-lap', `<small>Lap</small><b>1/${ TOTAL_LAPS }</b>` ); this.elLap.className = 'rk';
		this.elCoins = mk( 'rk-coins', `<span>🪙</span><b>0</b>` ); this.elCoins.className = 'rk';
		this.elTime = mk( 'rk-time', `<small>Time</small>0:00.00<br><small>Best</small>${ fmt( this._best() ) }` ); this.elTime.className = 'rk';
		this.elCenter = mk( 'rk-center', '' );
		this.elHint = mk( 'rk-hint', 'SPACE / tap item to use' );
		this.elResults = mk( 'rk-results', '' );
		this.elBanner = mk( 'rk-banner', '' );

		// minimap
		this.mapCv = document.createElement( 'canvas' );
		this.mapCv.id = 'rk-map'; this.mapCv.width = 132; this.mapCv.height = 132;
		document.body.appendChild( this.mapCv );
		this.mapCtx = this.mapCv.getContext( '2d' );
		const b2 = new THREE.Box3().setFromPoints( this.samples );
		const span = Math.max( b2.max.x - b2.min.x, b2.max.z - b2.min.z ) || 1;
		this._mapPt = p => [ 14 + ( p.x - b2.min.x ) / span * 104, 14 + ( p.z - b2.min.z ) / span * 104 ];

		// pause menu
		this.elPause = mk( 'rk-pause', '' );
		this.elPause.innerHTML = `
			<div class="card">
				<h2>PAUSED</h2>
				<button id="rk-resume" style="background:${ jdp ? '#00e5cc' : '#FFC400' };color:#111">Resume</button>
				<button id="rk-mute" style="background:rgba(255,255,255,.15);color:#fff">${ Sfx.muted ? '🔇 Sound: OFF' : '🔊 Sound: ON' }</button>
				<button style="background:rgba(255,255,255,.15);color:#fff" onclick="location.reload()">Restart Race</button>
				<button style="background:rgba(255,255,255,.15);color:#fff" onclick="location.href='./'">Quit to Garage</button>
			</div>`;
		this.elPause.querySelector( '#rk-resume' ).onclick = () => this.togglePause( false );
		this.elPause.querySelector( '#rk-mute' ).onclick = ( e ) => {
			Sfx.muted = ! Sfx.muted;
			e.target.textContent = Sfx.muted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
		};

	}

	_best() {
		try { const v = Number( localStorage.getItem( this.bestKey ) ); return isFinite( v ) && v > 0 ? v : null; }
		catch { return null; }
	}

	_bindInput() {

		const use = () => this._useItem();
		window.addEventListener( 'keydown', e => {
			if ( e.code === 'Space' ) { e.preventDefault(); use(); }
			if ( e.code === 'Escape' || e.code === 'KeyP' ) this.togglePause();
		} );
		this.elItem.style.pointerEvents = 'auto';
		this.elItem.addEventListener( 'pointerdown', use );

	}

	_countdown() {

		const btn = document.getElementById( 'playBtn' );
		const start = () => {
			let n = 3;
			const tick = () => {
				if ( n > 0 ) { this.elCenter.textContent = n; Sfx.count( n ); n --; setTimeout( tick, 800 ); }
				else {
					this.elCenter.textContent = 'GO!';
					Sfx.count( 0 );
					Sfx.musicStart();
					this.started = true;
					setTimeout( () => { this.elCenter.textContent = ''; }, 700 );
				}
			};
			tick();
		};
		if ( btn ) btn.addEventListener( 'click', () => setTimeout( start, 400 ), { once: true } );
		else start();

	}

	// ================= ITEMS =================
	_rollItem() {
		this.heldItem = ITEMS[ Math.floor( Math.random() * ITEMS.length ) ];
		this.elItem.textContent = this.heldItem.icon;
		this.elItem.classList.add( 'hold' );                       // pulse: you HAVE an item
		this.elHint.textContent = 'CLICK ITEM (or SPACE) to use ' + this.heldItem.icon;
	}

	_useItem() {

		if ( ! this.heldItem || this.finished ) return;
		const id = this.heldItem.id;
		Sfx.use();
		this.heldItem = null;
		this.elItem.textContent = '—';
		this.elItem.classList.remove( 'hold' );
		this.elHint.textContent = 'drive through an item box';

		if ( id === 'boost' ) {

			this.effects.boostT = 2.6;
			// instant Mario-Kart mushroom kick, not just a higher ceiling
			this.vehicle.linearSpeed = Math.max( this.vehicle.linearSpeed, MAX_SPEED * 1.35 );
			this._speedLines( 2.6 );

		}
		if ( id === 'star' ) {

			this.effects.starT = 4.5;
			this.vehicle.linearSpeed = Math.max( this.vehicle.linearSpeed, MAX_SPEED * 1.5 );
			this._speedLines( 4.5 );
			this._starGlow( 4.5 );

		}
		if ( id === 'zap' ) {

			this.effects.zapT = 3.5;
			for ( const ai of this.ais ) ai.spinT = 1.4; // they visibly spin out
			this._flash( '⚡' );

		}
		if ( id === 'shell' ) {

			// hit the nearest racer AHEAD of you
			const myProg = this.playerLaps + this.playerIdx / this.samples.length;
			let target = null, bestGap = Infinity;
			for ( const ai of this.ais ) {
				const gap = ( ai.laps + ai.u ) - myProg;
				if ( gap > 0 && gap < bestGap ) { bestGap = gap; target = ai; }
			}
			if ( ! target ) target = this.ais[ 0 ]; // nobody ahead? clip the closest anyway
			if ( target ) { target.freezeT = 2.0; target.spinT = 2.0; }
			this._flash( '🐢' );

		}

	}

	_flash( txt ) {
		this.elCenter.textContent = txt;
		setTimeout( () => { if ( ! this.finished ) this.elCenter.textContent = ''; }, 600 );
	}

	_overlay( id, css ) {
		let el = document.getElementById( id );
		if ( ! el ) {
			el = document.createElement( 'div' );
			el.id = id;
			el.style.cssText = 'position:fixed;inset:0;z-index:18;pointer-events:none;opacity:0;transition:opacity .25s;' + css;
			document.body.appendChild( el );
		}
		return el;
	}

	_speedLines( secs ) {
		const el = this._overlay( 'rk-speedlines',
			'background:repeating-conic-gradient(from 0deg at 50% 50%, transparent 0 9deg, rgba(255,255,255,.14) 9deg 10deg);' +
			'mask-image:radial-gradient(circle at 50% 50%, transparent 34%, black 78%);' +
			'-webkit-mask-image:radial-gradient(circle at 50% 50%, transparent 34%, black 78%);' );
		el.style.opacity = '1';
		clearTimeout( this._slT );
		this._slT = setTimeout( () => { el.style.opacity = '0'; }, secs * 1000 );
	}

	_starGlow( secs ) {
		const el = this._overlay( 'rk-starglow',
			'box-shadow:inset 0 0 140px 30px rgba(255,194,14,.55);' );
		el.style.opacity = '1';
		clearTimeout( this._sgT );
		this._sgT = setTimeout( () => { el.style.opacity = '0'; }, secs * 1000 );
	}

	togglePause( force ) {

		if ( this.finished ) return;
		this.paused = force !== undefined ? force : ! this.paused;
		this.elPause.style.display = this.paused ? 'flex' : 'none';
		if ( this.paused ) Sfx.musicStop(); else if ( this.started ) Sfx.musicStart();

	}

	_banner( txt, ms = 1400 ) {

		this.elBanner.textContent = txt;
		this.elBanner.classList.add( 'show' );
		clearTimeout( this._bT );
		this._bT = setTimeout( () => this.elBanner.classList.remove( 'show' ), ms );

	}

	// ================= UPDATE =================
	update( dt, input ) {

		if ( this.finished || this.paused ) return;

		const t = performance.now() / 1000;

		// spin pickups
		for ( const b of this.itemBoxes ) {
			if ( b.active ) { b.mesh.rotation.y += dt * 2; b.mesh.rotation.x += dt * 0.7; b.mesh.visible = true; }
			else { b.respawn -= dt; b.mesh.visible = false; if ( b.respawn <= 0 ) b.active = true; }
		}
		for ( const c of this.coinMeshes ) if ( ! c.taken ) c.mesh.rotation.z += dt * 3;

		if ( ! this.started ) return;

		this.raceTime += dt;

		// ---- effects ----
		let mul = this.baseSpeedMul;
		if ( this.effects.boostT > 0 ) { this.effects.boostT -= dt; mul *= 1.55; }
		if ( this.effects.starT > 0 ) { this.effects.starT -= dt; mul *= 1.75; }
		this.vehicle.speedMul = mul;
		const zap = this.effects.zapT > 0;
		if ( zap ) this.effects.zapT -= dt;

		// ---- player progress (incremental nearest-sample search) ----
		const pp = this.vehicle.spherePos;
		const N = this.samples.length;
		let best = Infinity, bestI = this.playerIdx;
		for ( let k = - 6; k <= 6; k ++ ) {
			const i = ( this.playerIdx + k + N ) % N;
			const s = this.samples[ i ];
			const d = ( s.x - pp.x ) * ( s.x - pp.x ) + ( s.z - pp.z ) * ( s.z - pp.z );
			if ( d < best ) { best = d; bestI = i; }
		}
		const stepLen = this.curveLen / N;
		let dIdx = ( bestI - this.playerIdx + N ) % N;
		if ( dIdx > N / 2 ) dIdx = 0; // ignore backward jumps
		this.playerSpeed = this.playerSpeed * 0.92 + ( dIdx * stepLen / Math.max( dt, 1e-4 ) ) * 0.08;
		if ( this.playerSpeed > this.topSpeedEst ) this.topSpeedEst = this.playerSpeed * 1.02;
		let dSigned = bestI - this.playerIdx;
		if ( dSigned > N / 2 ) dSigned -= N; else if ( dSigned < - N / 2 ) dSigned += N;
		this.playerIdx = bestI;
		this.playerLaps = ( this.lapTimer.lap || 1 ) - 1;
		const playerProg = this.playerLaps + this.playerIdx / N;

		// ---- wrong-way detector ----
		if ( dSigned < 0 && this.playerSpeed > 2 ) this.wrongT += dt; else this.wrongT = Math.max( 0, this.wrongT - dt * 2 );
		if ( this.wrongT > 0.7 ) {
			if ( ! this._wrongOn ) { this._wrongOn = true; Sfx.wrong(); }
			this._banner( '⛔ WRONG WAY!', 500 );
		} else this._wrongOn = false;

		// ---- drift mini-boost: hold a hard turn at speed, release to launch ----
		if ( input ) {
			const hardTurn = Math.abs( input.x ) > 0.55 && this.playerSpeed > this.topSpeedEst * 0.45;
			if ( hardTurn ) this.driftCharge = Math.min( 2, this.driftCharge + dt );
			else if ( Math.abs( input.x ) < 0.2 ) {
				if ( this.driftCharge > 0.9 ) {
					this.vehicle.linearSpeed = Math.max( this.vehicle.linearSpeed, MAX_SPEED * 1.25 );
					this._speedLines( 0.8 );
					Sfx.boost();
					this._banner( '💨 DRIFT BOOST', 700 );
				}
				this.driftCharge = 0;
			}
		}

		// ---- FINAL LAP moment ----
		const lapNow = Math.min( this.lapTimer.lap || 1, TOTAL_LAPS );
		if ( lapNow !== this.prevLapShown ) {
			this.prevLapShown = lapNow;
			if ( lapNow === TOTAL_LAPS ) { this._banner( '🏁 FINAL LAP!' ); Sfx.finalLap(); }
		}

		// ---- pickups collision ----
		for ( const b of this.itemBoxes ) {
			if ( ! b.active ) continue;
			const dx = b.mesh.position.x - pp.x, dz = b.mesh.position.z - pp.z;
			if ( dx * dx + dz * dz < 2.2 * 2.2 ) {
				b.active = false; b.respawn = 5;
				if ( ! this.heldItem ) { this._rollItem(); Sfx.pickup(); }
			}
		}
		for ( const c of this.coinMeshes ) {
			if ( c.taken ) continue;
			const dx = c.mesh.position.x - pp.x, dz = c.mesh.position.z - pp.z;
			if ( dx * dx + dz * dz < 1.7 * 1.7 ) {
				c.taken = true; c.mesh.visible = false;
				this.coins ++;
				this.elCoins.querySelector( 'b' ).textContent = this.coins;
				Sfx.coin();
			}
		}

		// ---- AI update ----
		let aheadOfPlayer = 0;
		for ( const ai of this.ais ) {

			ai.jitterT += dt;
			const aiProg = ai.laps + ai.u;

			// Real game-CPU driver: own target pace, launch acceleration,
			// braking into corners, mild rubber-band. Races whether you move or not.
			const tHere = this.curve.getTangentAt( ai.u );
			const tAhead = this.curve.getTangentAt( ( ai.u + 0.025 ) % 1 );
			const bend = 1 - THREE.MathUtils.clamp( ( 1 - tHere.dot( tAhead ) ) * 12, 0, 0.45 ); // brake up to 45% for corners

			let target = this.topSpeedEst * ai.paceMul * bend;
			if ( aiProg > playerProg + 0.35 ) target *= 0.85;       // don't disappear over the horizon
			else if ( aiProg < playerProg - 0.2 ) target *= 1.12;   // fight back when dropped
			if ( zap ) target *= 0.35;
			if ( this.effects.starT > 0 ) target *= 0.85;
			if ( ai.freezeT > 0 ) { ai.freezeT -= dt; target = 0; }

			// accelerate / brake like a driver — never teleport to a speed
			const rate = target > ai.speed ? 7 : 16;
			ai.speed += THREE.MathUtils.clamp( target - ai.speed, - rate * dt, rate * dt );

			const prevU = ai.u;
			ai.u = ( ai.u + ai.speed * dt / this.curveLen ) % 1;
			if ( ai.u < prevU ) ai.laps ++;
			ai.lateral = ( ai.lateral < 0 ? - 0.7 : 0.7 ) + Math.sin( ai.jitterT * 0.7 ) * 0.25;
			this._placeAI( ai );

			// contact: cars are not ghosts — bump, shove, and slow on touch
			const ddx = ai.group.position.x - pp.x, ddz = ai.group.position.z - pp.z;
			if ( ddx * ddx + ddz * ddz < 1.15 ) {
				if ( ! ai._touch ) { ai._touch = true; Sfx.bump(); }
				ai.lateral += ( ai.lateral >= 0 ? 0.5 : - 0.5 ) * dt * 8;   // AI dodges away
				ai.speed *= ( 1 - dt * 2 );                                  // both scrub speed
				this.vehicle.linearSpeed *= ( 1 - dt * 1.2 );
			} else ai._touch = false;
			ai.lateral = THREE.MathUtils.clamp( ai.lateral, - 1.6, 1.6 );

			if ( ai.spinT > 0 ) { ai.spinT -= dt; ai.group.rotation.y += dt * 14; } // spin-out
			if ( ai.laps + ai.u > playerProg ) aheadOfPlayer ++;

		}

		// ---- minimap ----
		const mc = this.mapCtx;
		mc.clearRect( 0, 0, 132, 132 );
		mc.strokeStyle = 'rgba(255,255,255,.5)'; mc.lineWidth = 4; mc.lineCap = 'round';
		mc.beginPath();
		for ( let i = 0; i <= 60; i ++ ) {
			const [ mx, my ] = this._mapPt( this.samples[ Math.floor( i / 60 * ( N - 1 ) ) ] );
			i === 0 ? mc.moveTo( mx, my ) : mc.lineTo( mx, my );
		}
		mc.closePath(); mc.stroke();
		for ( const ai of this.ais ) {
			const [ ax, ay ] = this._mapPt( ai.group.position );
			mc.fillStyle = '#ff5a4d'; mc.beginPath(); mc.arc( ax, ay, 4, 0, 7 ); mc.fill();
		}
		const [ px2, py2 ] = this._mapPt( pp );
		mc.fillStyle = '#ffc20e'; mc.beginPath(); mc.arc( px2, py2, 5.5, 0, 7 ); mc.fill();
		mc.strokeStyle = '#fff'; mc.lineWidth = 1.5; mc.stroke();

		// ---- HUD ----
		const lapShown = Math.min( this.lapTimer.lap || 1, TOTAL_LAPS );
		this.elLap.innerHTML = `<small>Lap</small><b>${ lapShown }/${ TOTAL_LAPS }</b>`;
		this.elPos.textContent = ORD[ aheadOfPlayer ];
		this.elTime.innerHTML = `<small>Time</small>${ fmt( this.raceTime ) }<br><small>Best</small>${ fmt( this._best() ) }`;

		// ---- finish ----
		if ( this.playerLaps >= TOTAL_LAPS ) this._finish( aheadOfPlayer );

	}

	_finish( aheadOfPlayer ) {

		this.finished = true;
		this.vehicle.speedMul = this.baseSpeedMul;
		Sfx.musicStop();
		Sfx.fanfare( aheadOfPlayer === 0 );

		const place = ORD[ aheadOfPlayer ];
		const prev = this._best();
		const isRecord = prev == null || this.raceTime < prev;
		if ( isRecord ) { try { localStorage.setItem( this.bestKey, String( this.raceTime ) ); } catch {} }
		if ( this.coins > 0 ) addCoins( this.coins );

		const jdp = this.theme === 'jdp';
		this.elResults.innerHTML = `
			<div class="card">
				<h2>${ place } PLACE</h2>
				<div class="line">Race time: ${ fmt( this.raceTime ) }</div>
				<div class="line">Best: ${ fmt( this._best() ) }</div>
				<div class="line">🪙 +${ this.coins } ${ this.coinLabel }</div>
				${ isRecord ? '<div class="rec">★ NEW RECORD ★</div>' : '' }
				<button style="background:${ jdp ? '#00e5cc' : '#FFC400' };color:#111" onclick="location.reload()">Rematch</button>
				<button style="background:rgba(255,255,255,.15);color:#fff" onclick="location.href='./'">Garage</button>
			</div>`;
		this.elResults.style.display = 'flex';
		this.elCenter.textContent = '🏁';

	}

}

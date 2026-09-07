// carModels.js — original procedural car models in TWO render styles:
//   'smooth' — beveled extruded bodies + detail parts (Lil Dev)
//   'voxel'  — high-detail 8-bit voxel builds (JDP)
// Archetypes EVOKE familiar silhouettes (hypercar / rear-engine classic /
// luxury SUV / coupe-SUV / compact) without copying any trade dress.
// Wheels are named "wheel-front-left" etc. so Vehicle.js steers/spins them.
import * as THREE from 'three';

// JDP surfaces get voxel cars; Lil Dev keeps smooth cartoon cars.
const STYLE = ( typeof location !== 'undefined' && location.pathname.includes( '/games/racer' ) ) ? 'smooth' : 'voxel';

function bodyMat( color ) { return new THREE.MeshStandardMaterial( { color, roughness: 0.35, metalness: 0.25 } ); }
function darkMat() { return new THREE.MeshStandardMaterial( { color: 0x141821, roughness: 0.2, metalness: 0.5 } ); }
function trimMat() { return new THREE.MeshStandardMaterial( { color: 0x0c0e12, roughness: 0.8, metalness: 0.1 } ); }

// ===================== SHARED PROFILE DATA =====================
// Side-profile polygons (x = length, y = height) — one per archetype.
// Used by BOTH styles so the silhouettes match across games.
const PROFILES = {
	hyper: {
		poly: [ [ -0.95, 0.08 ], [ -0.95, 0.42 ], [ -0.6, 0.47 ], [ -0.3, 0.52 ], [ 0, 0.5 ], [ 0.45, 0.3 ], [ 0.95, 0.16 ], [ 0.95, 0.08 ] ],
		w: 0.86, wheels: { f: 0.6, b: -0.6, r: 0.19 }, win: { y: 0.38, x0: -0.5, x1: 0.25 },
	},
	classic: {
		poly: [ [ -0.88, 0.1 ], [ -0.88, 0.28 ], [ -0.6, 0.34 ], [ -0.4, 0.48 ], [ -0.2, 0.55 ], [ 0.05, 0.56 ], [ 0.35, 0.44 ], [ 0.7, 0.3 ], [ 0.88, 0.24 ], [ 0.88, 0.1 ] ],
		w: 0.78, wheels: { f: 0.56, b: -0.56, r: 0.18 }, win: { y: 0.36, x0: -0.45, x1: 0.3 },
	},
	suv: {
		poly: [ [ -0.95, 0.12 ], [ -0.95, 0.8 ], [ 0.42, 0.8 ], [ 0.62, 0.52 ], [ 0.95, 0.48 ], [ 0.95, 0.12 ] ],
		w: 0.92, wheels: { f: 0.6, b: -0.6, r: 0.23 }, win: { y: 0.55, x0: -0.85, x1: 0.5 },
	},
	coupe: {
		poly: [ [ -0.95, 0.12 ], [ -0.95, 0.42 ], [ -0.55, 0.5 ], [ -0.3, 0.62 ], [ -0.05, 0.72 ], [ 0.35, 0.7 ], [ 0.6, 0.5 ], [ 0.95, 0.46 ], [ 0.95, 0.12 ] ],
		w: 0.9, wheels: { f: 0.58, b: -0.58, r: 0.22 }, win: { y: 0.5, x0: -0.7, x1: 0.45 },
	},
	compact: {
		poly: [ [ -0.62, 0.12 ], [ -0.62, 0.6 ], [ 0.28, 0.6 ], [ 0.5, 0.34 ], [ 0.66, 0.3 ], [ 0.66, 0.12 ] ],
		w: 0.74, wheels: { f: 0.4, b: -0.4, r: 0.18 }, win: { y: 0.42, x0: -0.55, x1: 0.35 },
	},
};

function pointInPoly( x, y, poly ) {

	let inside = false;
	for ( let i = 0, j = poly.length - 1; i < poly.length; j = i ++ ) {
		const [ xi, yi ] = poly[ i ], [ xj, yj ] = poly[ j ];
		if ( ( yi > y ) !== ( yj > y ) && x < ( xj - xi ) * ( y - yi ) / ( yj - yi ) + xi ) inside = ! inside;
	}
	return inside;

}

// ===================== SMOOTH STYLE =====================

function extrudeProfile( poly, width, material ) {

	const s = new THREE.Shape();
	s.moveTo( poly[ 0 ][ 0 ], poly[ 0 ][ 1 ] );
	for ( let i = 1; i < poly.length; i ++ ) s.lineTo( poly[ i ][ 0 ], poly[ i ][ 1 ] );
	s.closePath();
	const g = new THREE.ExtrudeGeometry( s, {
		depth: width, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.025, bevelSegments: 2, curveSegments: 8,
	} );
	g.translate( 0, 0, - width / 2 );
	g.rotateY( - Math.PI / 2 );
	const m = new THREE.Mesh( g, material );
	m.castShadow = true;
	return m;

}

function makeWheel( r, w ) {

	const g = new THREE.Group();
	g.add( new THREE.Mesh( new THREE.CylinderGeometry( r, r, w, 18 ).rotateZ( Math.PI / 2 ), trimMat() ) );
	g.add( new THREE.Mesh( new THREE.CylinderGeometry( r * 0.5, r * 0.5, w + 0.02, 10 ).rotateZ( Math.PI / 2 ),
		new THREE.MeshStandardMaterial( { color: 0xb9bec9, metalness: 0.8, roughness: 0.3 } ) ) );
	return g;

}

function addWheels( group, prof, style ) {

	const { f, b, r } = prof.wheels;
	const halfW = prof.w / 2;
	for ( const [ name, x, z ] of [
		[ 'wheel-front-left', halfW, f ], [ 'wheel-front-right', - halfW, f ],
		[ 'wheel-back-left', halfW, b ], [ 'wheel-back-right', - halfW, b ],
	] ) {
		const wh = style === 'voxel' ? voxelWheel( r ) : makeWheel( r, 0.15 );
		wh.name = name;
		wh.position.set( x, r * 0.95, z );
		group.add( wh );
	}

}

function box( group, w, h, d, x, y, z, material ) {

	const m = new THREE.Mesh( new THREE.BoxGeometry( w, h, d ), material );
	m.position.set( x, y, z );
	group.add( m );
	return m;

}

// Shared smooth detail pack: mirrors, exhausts, bumpers, plate.
function addDetails( g, prof, arch, color ) {

	const W = prof.w;
	// side mirrors
	for ( const x of [ - W / 2 - 0.05, W / 2 + 0.05 ] ) box( g, 0.06, 0.05, 0.08, x, prof.win.y + 0.12, prof.win.x1 * 0.9, bodyMat( color ) );
	// exhausts
	const exN = arch === 'hyper' ? [ - 0.1, 0.1 ] : [ - W / 2 + 0.14 ];
	for ( const x of exN ) {
		const ex = new THREE.Mesh( new THREE.CylinderGeometry( 0.035, 0.035, 0.1, 8 ).rotateX( Math.PI / 2 ), darkMat() );
		ex.position.set( x, 0.14, - 0.98 ); g.add( ex );
	}
	// bumpers
	box( g, W * 0.94, 0.06, 0.06, 0, 0.13, 0.97, trimMat() );
	box( g, W * 0.94, 0.06, 0.06, 0, 0.13, - 0.97, trimMat() );
	// tail-light strip
	box( g, W * 0.7, 0.04, 0.03, 0, 0.3, - 0.965,
		new THREE.MeshStandardMaterial( { color: 0xd0202a, emissive: 0x881016, emissiveIntensity: 0.6 } ) );

}

function smoothCar( arch, color ) {

	const prof = PROFILES[ arch ];
	const g = new THREE.Group();
	const W = prof.w;
	g.add( extrudeProfile( prof.poly, W, bodyMat( color ) ) );

	// glass canopy band
	const win = prof.win;
	const winLen = ( win.x1 - win.x0 );
	box( g, W * 0.86, 0.12, winLen, 0, win.y + 0.1, ( win.x0 + win.x1 ) / 2, darkMat() );

	if ( arch === 'hyper' ) {
		box( g, W + 0.14, 0.04, 0.2, 0, 0.58, - 0.88, darkMat() );                     // wing
		for ( const x of [ - W / 2 + 0.06, W / 2 - 0.06 ] ) box( g, 0.04, 0.14, 0.05, x, 0.48, - 0.86, darkMat() );
		box( g, W, 0.05, 0.16, 0, 0.07, 0.9, trimMat() );                              // splitter
	}
	if ( arch === 'classic' ) {
		for ( const x of [ - W / 2 + 0.12, W / 2 - 0.12 ] ) {
			const l = new THREE.Mesh( new THREE.SphereGeometry( 0.07, 10, 10 ),
				new THREE.MeshStandardMaterial( { color: 0xfff2cc, emissive: 0xffe9a8, emissiveIntensity: 0.5 } ) );
			l.position.set( x, 0.3, 0.84 ); g.add( l );
		}
		box( g, W * 0.8, 0.03, 0.1, 0, 0.34, - 0.86, darkMat() );                       // ducktail
	}
	if ( arch === 'suv' ) {
		for ( const x of [ - W / 2 + 0.08, W / 2 - 0.08 ] ) box( g, 0.05, 0.04, 1.2, x, 0.84, - 0.2, trimMat() );
		box( g, W * 0.7, 0.18, 0.05, 0, 0.34, 0.96, darkMat() );                        // grille
	}
	if ( arch === 'coupe' ) box( g, W * 0.6, 0.14, 0.05, 0, 0.32, 0.96, darkMat() );

	addDetails( g, prof, arch, color );
	addWheels( g, prof, 'smooth' );
	return g;

}

// ===================== VOXEL STYLE (8-bit, high detail) =====================

const VOX = 0.075;

function voxelWheel( r ) {

	// chunky plus-shaped 8-bit wheel
	const g = new THREE.Group();
	const s = VOX * 1.1;
	const tire = trimMat();
	const hub = new THREE.MeshStandardMaterial( { color: 0xb9bec9, metalness: 0.7, roughness: 0.4 } );
	for ( let dy = - 1; dy <= 1; dy ++ ) for ( let dz = - 1; dz <= 1; dz ++ ) {
		if ( Math.abs( dy ) === 1 && Math.abs( dz ) === 1 ) continue; // knock corners off
		const m = new THREE.Mesh( new THREE.BoxGeometry( s * 1.6, s, s ), ( dy === 0 && dz === 0 ) ? hub : tire );
		m.position.set( 0, dy * s, dz * s );
		g.add( m );
	}
	g.scale.setScalar( r / ( VOX * 2.2 ) );
	return g;

}

function voxelCar( arch, color ) {

	const prof = PROFILES[ arch ];
	const g = new THREE.Group();
	const poly = prof.poly;
	const W = prof.w;
	const base = new THREE.Color( color );

	const xs = poly.map( p => p[ 0 ] ), ys = poly.map( p => p[ 1 ] );
	const x0 = Math.min( ...xs ), x1 = Math.max( ...xs );
	const y0 = 0.06, y1 = Math.max( ...ys );
	const halfW = W / 2;

	// color buckets -> InstancedMesh (fast even at ~2k voxels)
	const buckets = new Map();
	const put = ( c, x, y, z ) => {
		const k = c.getHexString();
		if ( ! buckets.has( k ) ) buckets.set( k, { color: c.clone(), pts: [] } );
		buckets.get( k ).pts.push( [ x, y, z ] );
	};

	const cShadeA = base.clone().multiplyScalar( 1.05 );
	const cShadeB = base.clone().multiplyScalar( 0.88 );
	const cGlass = new THREE.Color( 0x10141c );
	const cGlassHi = new THREE.Color( 0x2a3a52 );
	const cTrim = new THREE.Color( 0x0c0e12 );
	const cLight = new THREE.Color( 0xfff0b8 );
	const cTail = new THREE.Color( 0xd0202a );

	const wf = prof.wheels.f, wb = prof.wheels.b, wr = prof.wheels.r;

	for ( let x = x0 + VOX / 2, ix = 0; x < x1; x += VOX, ix ++ ) {
		for ( let y = y0 + VOX / 2, iy = 0; y < y1; y += VOX, iy ++ ) {

			if ( ! pointInPoly( x, y, poly ) ) continue;
			// carve wheel wells (front + back)
			if ( Math.hypot( x - wf, y - wr ) < wr + 0.05 ) continue;
			if ( Math.hypot( x - wb, y - wr ) < wr + 0.05 ) continue;

			// cabin narrows near the roof for a real body shape
			const roofNarrow = y > y1 * 0.72 ? 0.82 : 1;
			const hw = halfW * roofNarrow;

			const isWin = y > prof.win.y + 0.06 && x > prof.win.x0 && x < prof.win.x1;
			const isFront = x > x1 - VOX * 1.6;
			const isBack = x < x0 + VOX * 1.6;
			const lightBand = y > y1 * 0.3 && y < y1 * 0.55;

			for ( let z = - hw + VOX / 2, iz = 0; z < hw; z += VOX, iz ++ ) {

				const surface = ( z < - hw + VOX || z > hw - VOX );
				let c;
				if ( isWin && ( surface || y > y1 - VOX * 1.5 ) ) c = ( ( ix + iz ) % 3 === 0 ) ? cGlassHi : cGlass; // glass w/ pixel glints
				else if ( isFront && lightBand && Math.abs( z ) > hw * 0.4 ) c = cLight;   // headlights
				else if ( isBack && lightBand ) c = cTail;                                  // tail band
				else if ( isFront && y < y1 * 0.3 ) c = cTrim;                              // grille / intake
				else c = ( ( ix + iy + iz ) % 2 === 0 ) ? cShadeA : cShadeB;               // dither shading

				put( c, z, y, x ); // world: width=X, height=Y, length=Z (profile x -> world z)

			}

		}
	}

	// archetype accents (voxel strips)
	if ( arch === 'hyper' ) {
		for ( let z = - halfW - VOX; z <= halfW + VOX; z += VOX ) { put( cTrim, z, y1 + VOX * 1.2, x0 + VOX ); put( cTrim, z, y1 + VOX * 0.4, x0 + VOX ); }
	}
	if ( arch === 'suv' ) {
		for ( let x = x0 + VOX * 3; x < x1 - VOX * 5; x += VOX ) { put( cTrim, - halfW + VOX, y1 + VOX * 0.6, x ); put( cTrim, halfW - VOX, y1 + VOX * 0.6, x ); }
	}
	if ( arch === 'classic' ) {
		put( cLight, - halfW + VOX * 1.5, 0.32, x1 - VOX * 0.5 ); put( cLight, halfW - VOX * 1.5, 0.32, x1 - VOX * 0.5 );
	}

	// build instanced meshes
	const geo = new THREE.BoxGeometry( VOX, VOX, VOX );
	const dummy = new THREE.Object3D();
	for ( const { color: c, pts } of buckets.values() ) {
		const im = new THREE.InstancedMesh( geo, new THREE.MeshStandardMaterial( { color: c, roughness: 0.55, metalness: 0.2 } ), pts.length );
		for ( let i = 0; i < pts.length; i ++ ) {
			dummy.position.set( pts[ i ][ 0 ], pts[ i ][ 1 ], pts[ i ][ 2 ] );
			dummy.updateMatrix();
			im.setMatrixAt( i, dummy.matrix );
		}
		im.castShadow = true;
		g.add( im );
	}

	addWheels( g, prof, 'voxel' );
	return g;

}

// ===================== ENTRY POINT =====================

const ARCHES = new Set( Object.keys( PROFILES ) );

export function getCarModel( spec, models = {}, style = STYLE ) {

	if ( ARCHES.has( spec.build ) ) {
		const color = spec.color != null ? spec.color : 0xffc20e;
		return style === 'voxel' ? voxelCar( spec.build, color ) : smoothCar( spec.build, color );
	}

	// fallback: tinted kit truck
	const b = models[ spec.model ];
	if ( ! b ) return new THREE.Group();
	const m = b.clone( true );
	if ( spec.color != null ) {
		const tint = new THREE.Color( spec.color );
		m.traverse( o => {
			if ( o.isMesh && ! /wheel|tyre|tire|glass|window|light|lamp/i.test( o.name ) ) {
				o.material = o.material.clone();
				if ( o.material.color ) o.material.color.copy( tint );
			}
		} );
	}
	return m;

}

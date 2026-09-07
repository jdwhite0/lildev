// tracks.js — 7 venture circuits with genuinely different layouts.
// Each track is defined as an ordered loop of corner waypoints; expandLoop()
// walks the loop cell-by-cell and derives the correct piece + orientation
// (rules verified against the kit's default track):
//   corner opens {+x,+z}=16  {-x,+z}=0  {-x,-z}=22  {+x,-z}=10
//   vertical straight=0, horizontal straight=22 (+x travel) / 16 (-x travel)
import { TRACK_CELLS } from './Track.js';

function expandLoop( wps ) {

	// walk waypoint-to-waypoint into unit cells (ordered loop)
	const pts = [];
	for ( let i = 0; i < wps.length; i ++ ) {
		let [ x, z ] = wps[ i ];
		const [ bx, bz ] = wps[ ( i + 1 ) % wps.length ];
		const dx = Math.sign( bx - x ), dz = Math.sign( bz - z );
		while ( x !== bx || z !== bz ) { pts.push( [ x, z ] ); x += dx; z += dz; }
	}

	const N = pts.length;
	const cells = [];
	for ( let i = 0; i < N; i ++ ) {

		const [ x, z ] = pts[ i ];
		const [ px, pz ] = pts[ ( i - 1 + N ) % N ];
		const [ nx, nz ] = pts[ ( i + 1 ) % N ];
		const dirs = new Set( [
			px < x ? '-x' : px > x ? '+x' : pz < z ? '-z' : '+z',
			nx < x ? '-x' : nx > x ? '+x' : nz < z ? '-z' : '+z',
		] );

		let piece, orient;
		if ( dirs.has( '+z' ) && dirs.has( '-z' ) ) { piece = 'track-straight'; orient = 0; }
		else if ( dirs.has( '+x' ) && dirs.has( '-x' ) ) { piece = 'track-straight'; orient = nx > x ? 22 : 16; }
		else if ( dirs.has( '+x' ) && dirs.has( '+z' ) ) { piece = 'track-corner'; orient = 16; }
		else if ( dirs.has( '-x' ) && dirs.has( '+z' ) ) { piece = 'track-corner'; orient = 0; }
		else if ( dirs.has( '-x' ) && dirs.has( '-z' ) ) { piece = 'track-corner'; orient = 22; }
		else { piece = 'track-corner'; orient = 10; }
		cells.push( [ x, z, piece, orient ] );

	}

	// finish line goes on the first vertical straight
	const f = cells.find( c => c[ 2 ] === 'track-straight' && c[ 3 ] === 0 );
	if ( f ) f[ 2 ] = 'track-finish';
	return cells;

}

export const TRACKS = [
	{
		id: 'jdp-grand-prix', name: 'JDP Grand Prix', venture: 'JDP',
		blurb: 'The original S-circuit. Deep space, aurora skies, home of the grid.',
		cells: null, // the kit's built-in S-track
		ground: 0x0b0b26, tint: 0xbfc4ff, hemi: 0x8090ff, sun: 0xcfd6ff,
		sky: 0x04040e, fog: 0x0a0a1e, emoji: '◈',
	},
	{
		id: 'access-circuit', name: 'ACCESS Circuit', venture: 'ACCESS',
		blurb: 'An L-shaped descent with a blind inner corner. Cyan on void.',
		cells: expandLoop( [ [ 0, 0 ], [ 4, 0 ], [ 4, 2 ], [ 2, 2 ], [ 2, 4 ], [ 0, 4 ] ] ),
		ground: 0x04191e, tint: 0x9fe8ef, hemi: 0x33e0e0, sun: 0xbffcf5,
		sky: 0x02070a, fog: 0x073039, emoji: '⬡',
	},
	{
		id: 'jdpay-speedway', name: 'JDPay Speedway', venture: 'JDPay',
		blurb: 'A giant Z: two monster straights linked by a hard mid-chicane.',
		cells: expandLoop( [ [ -5, -1 ], [ 4, -1 ], [ 4, 1 ], [ -1, 1 ], [ -1, 3 ], [ -5, 3 ] ] ),
		ground: 0x1c0c04, tint: 0xffc79a, hemi: 0xff9a55, sun: 0xffd9b0,
		sky: 0x0a0503, fog: 0x2b1206, emoji: '▰',
	},
	{
		id: 'lildev-loop', name: 'Lil Dev Loop', venture: 'Lil Dev',
		blurb: 'Tiny, tight, all corners. Where every racer starts.',
		cells: expandLoop( [ [ 0, 0 ], [ 2, 0 ], [ 2, 2 ], [ 0, 2 ] ] ),
		ground: 0x7fc86a, tint: 0xffffff, hemi: 0xbfe3ff, sun: 0xffffff,
		sky: 0xbfe3ff, fog: 0xbfe3ff, emoji: '☀',
	},
	{
		id: 'productions-stage', name: 'Productions Stage', venture: 'JD Productions',
		blurb: 'An eight-corner staircase. Every turn is a new shot.',
		cells: expandLoop( [ [ -4, -3 ], [ 1, -3 ], [ 1, -1 ], [ 3, -1 ], [ 3, 2 ], [ -2, 2 ], [ -2, 0 ], [ -4, 0 ] ] ),
		ground: 0x231806, tint: 0xffe2a8, hemi: 0xd4a017, sun: 0xffe9b8,
		sky: 0x0d0a04, fog: 0x33270a, emoji: '◆',
	},
	{
		id: 'jyson-sprint', name: 'JYSON Sprint', venture: 'JYSON',
		blurb: 'A double-step zigzag. Tight, smart, zero wasted motion.',
		cells: expandLoop( [ [ 0, -2 ], [ 2, -2 ], [ 2, 0 ], [ 4, 0 ], [ 4, 2 ], [ 0, 2 ] ] ),
		ground: 0x07141f, tint: 0xaad4f0, hemi: 0x4aa8d8, sun: 0xcfe9ff,
		sky: 0x03080d, fog: 0x0a2433, emoji: '✦',
	},
	{
		id: 'bridge-run', name: 'Bridge Run', venture: 'Bridge Video',
		blurb: 'The longest lap on the calendar — with a horseshoe notch that bites.',
		cells: expandLoop( [ [ -5, -2 ], [ 4, -2 ], [ 4, 3 ], [ 1, 3 ], [ 1, 1 ], [ -2, 1 ], [ -2, 3 ], [ -5, 3 ] ] ),
		ground: 0x230d04, tint: 0xffb08a, hemi: 0xe95324, sun: 0xffc9a3,
		sky: 0x120602, fog: 0x381408, emoji: '▲',
	},
];

export function getTrack( id ) {

	return TRACKS.find( t => t.id === id ) || TRACKS[ 0 ];

}

export function getSelectedTrack() {
	try { return localStorage.getItem( 'jdRacerTrack' ) || TRACKS[ 0 ].id; }
	catch { return TRACKS[ 0 ].id; }
}
export function setSelectedTrack( id ) {
	try { localStorage.setItem( 'jdRacerTrack', id ); } catch {}
}

export { TRACK_CELLS };

// JDP Racer — Car Catalog (data-driven).
// Each car is ONE object. To drop in a real 3D model later, change `model` to the new
// GLB key (and register it in main.js `modelNames`). `color` re-tints the base mesh.
//
// NAMING NOTE: original names are used on purpose. The archetypes echo real cars
// (noted in `echoes`) but trademarked names (Ferrari, Porsche, Range Rover, Mercedes)
// must NOT ship in a commercial storefront. Relabel privately only.
//
// Base meshes available today: vehicle-truck-yellow | -red | -green | -purple

export const CARS = [
	{
		id: 'city-runner', build: 'compact', name: 'City Runner', klass: 'Starter',
		model: 'vehicle-truck-yellow', color: null, // default livery
		accel: 1.00, grip: 1.00, speed: 1.00, handling: 'Balanced', tier: 'starter',
		priceJDP: 0, priceCoins: 0, echoes: 'starter kit',
		blurb: 'Your first ride. Free with every account.'
	},
	{
		id: 'heritage-9', build: 'classic', name: 'Heritage 9', klass: 'Sports Classic',
		model: 'vehicle-truck-yellow', color: 0xc7ccd6, // silver
		accel: 1.10, grip: 1.15, speed: 1.15, handling: 'Nimble', tier: 'standard',
		priceJDP: 300, priceCoins: 600, echoes: 'Porsche 911',
		blurb: 'Rear-engine icon. Light, quick, and precise through corners.'
	},
	{
		id: 'rosso-gt', build: 'hyper', name: 'Rosso GT', klass: 'Hypercar',
		model: 'vehicle-truck-red', color: 0xe01a1a, // rosso red
		accel: 1.25, grip: 0.95, speed: 1.30, handling: 'Aggressive', tier: 'premium',
		priceJDP: 600, priceCoins: 1200, echoes: 'Ferrari',
		blurb: 'Mid-engine monster. The highest top speed in the JDP grid.'
	},
	{
		id: 'range-monarch', build: 'suv', name: 'Range Monarch', klass: 'Luxury SUV',
		model: 'vehicle-truck-green', color: 0x1b2a20, // deep forest / black
		accel: 0.90, grip: 1.20, speed: 1.05, handling: 'Planted', tier: 'premium',
		priceJDP: 450, priceCoins: 900, echoes: 'Range Rover',
		blurb: 'Heavy, grippy, unstoppable. Rules the rough parts of the track.'
	},
	{
		id: 'crest-coupe', build: 'coupe', name: 'Crest Coupe', klass: 'Coupe SUV',
		model: 'vehicle-truck-purple', color: 0x363b46, // graphite
		accel: 1.05, grip: 1.05, speed: 1.10, handling: 'Composed', tier: 'premium',
		priceJDP: 400, priceCoins: 800, echoes: 'Mercedes GLE',
		blurb: 'Sport-luxury crossover. Fast in a suit.'
	},
	{
		id: 'aurora-edition', build: 'hyper', name: 'Aurora Edition', klass: 'Limited Livery',
		model: 'vehicle-truck-red', color: 0x00e5cc, // JDP teal
		accel: 1.20, grip: 1.00, speed: 1.25, handling: 'Aggressive', tier: 'limited',
		priceJDP: 800, priceCoins: 1600, echoes: 'JDP special',
		blurb: 'A Rosso GT wrapped in JDP aurora teal. Limited run.'
	},
	{
		id: 'gold-rush', build: 'coupe', name: 'Gold Rush', klass: 'Limited Livery',
		model: 'vehicle-truck-purple', color: 0xffc20e, // JDP gold
		accel: 1.10, grip: 1.05, speed: 1.20, handling: 'Composed', tier: 'limited',
		priceJDP: 1000, priceCoins: 2000, echoes: 'JDP special',
		blurb: 'Solid gold Crest. The flex car of the JDP grid.'
	},
];

// ---- Local ownership + selection (per-origin storage; JDP and Lil Dev stay separate) ----
const K_OWNED = 'jdRacerOwned', K_SELECTED = 'jdRacerSelectedCar', K_COINS = 'jdRacerCoins';

export function getOwned() {
	try { return JSON.parse(localStorage.getItem(K_OWNED)) || ['city-runner']; }
	catch { return ['city-runner']; }
}
export function setOwned(list) { localStorage.setItem(K_OWNED, JSON.stringify([...new Set(list)])); }
export function owns(id) { return getOwned().includes(id); }
export function grant(id) { const o = getOwned(); o.push(id); setOwned(o); }

export function getSelected() { return localStorage.getItem(K_SELECTED) || 'city-runner'; }
export function setSelected(id) { localStorage.setItem(K_SELECTED, id); }

export function getCoins() { const v = localStorage.getItem(K_COINS); return v == null ? 300 : (parseInt(v, 10) || 0); }
export function setCoins(n) { localStorage.setItem(K_COINS, String(Math.max(0, n | 0))); }
export function addCoins(n) { setCoins(getCoins() + n); }

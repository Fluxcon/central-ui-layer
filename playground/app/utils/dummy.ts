export type Period = 'daily' | 'weekly' | 'monthly';

export type Stat = { title: string; icon: string; value: string; variation: number };

export type Activation = {
	id: string;
	date: string; // ISO
	status: 'active' | 'pending' | 'failed';
	device: string; // e.g. 'IMEI 300234010123456'
	account: string;
	bytes: number;
};

type Point = { ts: number; activations: number; bytes: number };

const DAY = 86400000;

export const ANCHOR = Date.UTC(2026, 9, 21);

export function mulberry32(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const dayFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const numberFormat = new Intl.NumberFormat('en-GB');
const currencyFormat = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatBytes(n: number): string {
	let value = n;
	let i = 0;
	while (value >= 1024 && i < UNITS.length - 1) {
		value /= 1024;
		i++;
	}
	return `${value.toFixed(1)} ${UNITS[i]}`;
}

function dailyPoints(days: number): Point[] {
	const rand = mulberry32(days);
	const points: Point[] = [];
	for (let i = days - 1; i >= 0; i--) {
		const ts = ANCHOR - i * DAY;
		const dow = new Date(ts).getUTCDay();
		const weekend = dow === 0 || dow === 6;
		const activations = Math.round((weekend ? 35 : 75) * (0.6 + 0.8 * rand()));
		const bytes = Math.round((weekend ? 0.8 : 1) * (50000000 + rand() * 350000000));
		points.push({ ts, activations, bytes });
	}
	return points;
}

function aggregate(
	points: Point[],
	keyOf: (ts: number) => number,
	labelOf: (ts: number) => string,
): { labels: string[]; activations: number[]; bytes: number[] } {
	const groups = new Map<number, { label: string; activations: number; bytes: number }>();
	for (const p of points) {
		const key = keyOf(p.ts);
		let group = groups.get(key);
		if (!group) {
			// Points are chronological, so the first point of a group is its start date.
			group = { label: labelOf(p.ts), activations: 0, bytes: 0 };
			groups.set(key, group);
		}
		group.activations += p.activations;
		group.bytes += p.bytes;
	}
	const list = Array.from(groups.values());
	return {
		labels: list.map((g) => g.label),
		activations: list.map((g) => g.activations),
		bytes: list.map((g) => g.bytes),
	};
}

export function buildSeries(days: number, period: Period): { labels: string[]; activations: number[]; bytes: number[] } {
	const points = dailyPoints(days);
	const dayLabel = (ts: number) => dayFormat.format(ts);

	if (period === 'weekly') {
		// 7-day buckets aligned so the last bucket ends at ANCHOR.
		return aggregate(points, (ts) => Math.floor((ANCHOR - ts) / (7 * DAY)), dayLabel);
	}
	if (period === 'monthly') {
		return aggregate(
			points,
			(ts) => {
				const d = new Date(ts);
				return d.getUTCFullYear() * 12 + d.getUTCMonth();
			},
			(ts) => monthFormat.format(ts),
		);
	}
	return aggregate(points, (ts) => ts, dayLabel);
}

export function buildStats(days: number): Stat[] {
	const series = buildSeries(days, 'daily');
	const activations = series.activations.reduce((sum, n) => sum + n, 0);
	const bytes = series.bytes.reduce((sum, n) => sum + n, 0);

	const rand = mulberry32(days + 1);
	const variation = () => Math.floor(rand() * 41) - 15; // integer in -15..25

	const revenue = activations * 4.5 + (bytes / 1000000) * 0.02;

	return [
		{ title: 'SBD activations', icon: 'i-lucide-satellite-dish', value: numberFormat.format(activations), variation: variation() },
		{ title: 'Usage', icon: 'i-lucide-database', value: formatBytes(bytes), variation: variation() },
		{ title: 'Active devices', icon: 'i-lucide-radio-tower', value: numberFormat.format(300 + Math.floor(rand() * 601)), variation: variation() },
		{ title: 'Revenue', icon: 'i-lucide-circle-dollar-sign', value: currencyFormat.format(revenue), variation: variation() },
	];
}

const RECENT: { minutesAgo: number; status: Activation['status']; device: string; account: string; bytes: number }[] = [
	{ minutesAgo: 14, status: 'active', device: 'IMEI 300234010123456', account: 'Maritime Co', bytes: 48213 },
	{ minutesAgo: 95, status: 'pending', device: 'IMEI 300234010654321', account: 'Arctic Survey', bytes: 0 },
	{ minutesAgo: 380, status: 'active', device: 'IMEI 300234063123987', account: 'Northern Rail', bytes: 1204880 },
	{ minutesAgo: 610, status: 'failed', device: 'IMEI 300234010777001', account: 'Blue Harbour Ltd', bytes: 0 },
	{ minutesAgo: 905, status: 'active', device: 'IMEI 300234011992834', account: 'Polar Fisheries', bytes: 356720 },
	{ minutesAgo: 1260, status: 'pending', device: 'IMEI 300234065550112', account: 'Atlas Mining', bytes: 0 },
	{ minutesAgo: 1710, status: 'active', device: 'IMEI 300234010880245', account: 'Fjord Logistics', bytes: 9982450 },
	{ minutesAgo: 2640, status: 'failed', device: 'IMEI 300234063440018', account: 'Summit Energy', bytes: 0 },
];

export function buildRecent(): Activation[] {
	return RECENT.map((row, i) => ({
		id: String(4821 - i),
		date: new Date(ANCHOR - row.minutesAgo * 60000).toISOString(),
		status: row.status,
		device: row.device,
		account: row.account,
		bytes: row.bytes,
	})).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

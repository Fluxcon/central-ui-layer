import colors from 'tailwindcss/colors';

// The app's BrandIcon as a standalone SVG, from `app.icon`. A favicon is its own document, so page CSS
// variables don't reach it: the colour is resolved here to Nuxt UI's shades (500 light, 400 dark).
// Same geometry as app/components/BrandIcon.vue; keep the two in sync.
export default defineEventHandler((event) => {
	const { app, ui } = useAppConfig() as {
		app: { icon: { color: string; legs: number[] } };
		ui: { colors: Record<string, string> };
	};
	const name = ui.colors[app.icon.color] ?? app.icon.color;
	const shades = (colors as Record<string, Record<number, string> | undefined>)[name];
	const legs = app.icon.legs.length ? app.icon.legs : [0, 120, 240];
	const cuts = [0, 1, 2]
		.map((i) => `<path d="M256 256V0" transform="rotate(${legs[Math.min(i, legs.length - 1)]} 256 256)"/>`)
		.join('');

	setHeader(event, 'Content-Type', 'image/svg+xml');
	setHeader(event, 'Cache-Control', 'public, max-age=86400');
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<style>svg{--c:${shades?.[500] ?? name}}@media (prefers-color-scheme:dark){svg{--c:${shades?.[400] ?? name}}}</style>
<mask id="m"><rect width="512" height="512" fill="white"/><g stroke="black" stroke-width="50">${cuts}</g></mask>
<circle cx="256" cy="256" r="225" fill="none" stroke="var(--c)" stroke-width="50" mask="url(#m)"/>
<circle cx="256" cy="256" r="75" fill="var(--c)"/>
</svg>`;
});

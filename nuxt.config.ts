import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	modules: ['@nuxt/ui', '@nuxt/eslint'],
	// Absolute, so it resolves when an app extends this layer from another directory.
	css: [fileURLToPath(new URL('./app/assets/css/main.css', import.meta.url))],

	// Bundles `carbon:*` icons at build time; without it @nuxt/icon fetches each at
	// runtime, which races SSR on cold start and logs "failed to load icon". `scan`
	// only sees the consuming app's components, so icons used inside Nuxt UI's own
	// templates (sidebar collapse, colour mode toggle) are listed explicitly.
	icon: {
		clientBundle: {
			scan: true,
			icons: [
				'carbon:side-panel-close',
				'carbon:side-panel-open-filled',
				'carbon:menu',
				'carbon:moon',
				'carbon:sun',
				'carbon:chevron-right',
			],
		},
	},

	// Nuxt UI only aliases colours declared here. Arrays from the app's own config
	// are merged in, so an app that needs extra aliases (v4's per-company badge
	// colours) lists only those.
	ui: {
		theme: {
			colors: ['primary', 'secondary', 'tertiary', 'highlight', 'success', 'info', 'warning', 'error', 'neutral'],
		},
	},

	app: {
		head: {
			htmlAttrs: { lang: 'en' },
			meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
			// Served by server/routes/favicon.svg.ts from `app.icon`.
			link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
		},
	},
});

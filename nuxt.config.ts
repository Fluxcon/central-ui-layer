import { fileURLToPath } from 'node:url';

const layerDir = fileURLToPath(new URL('./', import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	modules: [
		'@nuxt/ui',
		'@nuxt/eslint',
		// An app extending a local checkout (`extends: ['../central-ui-layer']`) would otherwise resolve the layer's
		// bare imports from this repo's node_modules: a second Vue, and a crash in renderSlot. Vite's `resolve.dedupe`
		// doesn't help (rolldown's resolver ignores it here). Resolve them from the app instead, as a `github:`
		// download (no node_modules of its own) already does; the deps are peerDependencies anyway.
		(_, nuxt) => {
			const from = `${nuxt.options.rootDir}/package.json`;
			nuxt.hook('vite:extendConfig', (config) => {
				config.plugins?.push({
					name: 'central-ui-layer:deps-from-app',
					enforce: 'pre',
					resolveId(id: string, importer: string | undefined, options: { isEntry: boolean }) {
						if (!importer?.startsWith(layerDir) || importer.includes('/node_modules/')) return;
						if (/^[./\0#~]|^[a-z]+:/i.test(id)) return;
						return this.resolve(id, from, { ...options, skipSelf: true });
					},
				});
			});
		},
	],
	// Absolute, so it resolves when an app extends this layer from another directory.
	css: [fileURLToPath(new URL('./app/assets/css/main.css', import.meta.url))],
	// The layer's types for apps: `import type { AppNavItem } from '#central-ui'`.
	alias: { '#central-ui': `${layerDir}app/types/app-config` },

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

import type { NavigationMenuItem } from '@nuxt/ui';

/** An item for `app.nav`. `match` decides when it shows active: 'exact', or a path prefix (default: `to`). */
export type AppNavItem = NavigationMenuItem & { match?: 'exact' | string };

declare module '@nuxt/schema' {
	interface AppConfigInput {
		app?: {
			/** Large wordmark line in the sidebar header. */
			name?: string;
			/** Small line above the name, and the footer copyright holder. Empty hides the small line. */
			company?: string;
			/** Where the logo links. */
			home?: string;
			/** localStorage key for the sidebar's size/collapse state. Unique per app. */
			storageKey?: string;
			/** Classes for the name line; defaults to v4's `text-2xl tracking-widest`. */
			nameClass?: string;
			nav?: AppNavItem[];
		};
	}
}

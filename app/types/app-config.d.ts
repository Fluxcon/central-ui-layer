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
			/** Classes for the name line; defaults to v4's `text-[12cqi] tracking-widest`. */
			nameClass?: string;
			/** The app's BrandIcon, used by the sidebar logo and `/favicon.svg`. Layer default: primary; no legs draws three at 0/120/240. */
			icon?: {
				/** A Nuxt UI colour key (`primary`, ...). */
				color?: string;
				/** Up to three angles in degrees, clockwise from north. */
				legs?: number[];
			};
			nav?: AppNavItem[];
		};
	}
}

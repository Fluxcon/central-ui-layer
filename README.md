# central-ui-layer

Nuxt 4 layer holding the shared design of central-v4, extracted without changes: Nuxt UI v4 setup, Carbon icons,
toast/link/button variants, the sidebar dashboard shell, and a few pure-UI composables. central-v4, SBDActivate v2 and
IWS proxy v2 `extends:` it instead of copying.

Contents: What is in it · Using it (What the app provides) · Left out, and why · Versioning · Develop

## What is in it

| Path | What |
|---|---|
| `nuxt.config.ts` | `@nuxt/ui` + `@nuxt/eslint`, `main.css`, icon clientBundle, `ui.theme.colors` (9 semantic colours), `lang`/viewport head, favicon link |
| `app/app.config.ts` | v4's `ui` defaults (colours with **primary = orange**, Carbon icons, link/button/toast variants) and the `app` shell defaults |
| `app/assets/css/main.css` | fonts (Noto), green palette, `touch`/`no-touch` variants, `--ui-full-header-height`, `shake` animation |
| `app/app.vue` | `UApp` (toaster top-centre), loading indicator, `NuxtLayout` |
| `app/layouts/default.vue` | renders `AppShell` with `app.nav` |
| `app/components/AppShell.vue` | sidebar dashboard shell (props: `items`; slots: `footer-actions`, default) |
| `app/components/PagePanel.vue` | v4's page frame: navbar (title, back button from two levels below `app.home` to the parent crumb, `right` slot) and toolbar (breadcrumbs left, `actions` slot right). Props `id`, `title`, `breadcrumbs`, `ui` |
| `app/components/BrandLogo.vue` | logo + wordmark, from `app.company` / `app.name` / `app.home` / `app.nameClass` / `app.icon` |
| `app/components/LoginBackdrop.vue` | the login page's blurred gradient, a centred default slot for the card, and a colour-mode button. Prop `color`: `'orange'` (v4, IWS) or `'blue'` (SBDA) |
| `app/components/BrandIcon.vue` | the shared ring-and-dot mark, cut by up to three legs. Props `color` (Nuxt UI colour), `legs` (degrees) |
| `app/components/UserCard.vue` | colour-mode toggle + user menu. Props `name`, `email`, `image`, `profile`; emits `logout`, `profile` |
| `server/routes/favicon.svg.ts` | `/favicon.svg`: the app's BrandIcon from `app.icon`, as a standalone SVG |
| `app/composables/` | `useAppToast`, `useDebounced`, `useLocalStorage` |
| `app/utils/api-error.ts` | `apiErrorMessage` (h3 error body to toast text) |
| `app/types/app-config.d.ts` | the `app` config schema and `AppNavItem`, importable as `#central-ui` |

## Using it

```ts
// nuxt.config.ts
extends: ['../central-ui-layer']                                // local checkout, while working on the layer
extends: ['github:Fluxcon/central-ui-layer#v0.0.3']             // pinned tag; private repo needs GIGET_AUTH=<token>
```

A local checkout needs nothing else: the layer resolves its own bare imports (`vue`, `@nuxt/ui`, ...) from the app, so
the page gets the app's single Vue even though this repo has its own `node_modules`. Commit only the pinned tag.

The app must itself depend on `nuxt`, `@nuxt/ui`, `tailwindcss`, `@iconify-json/carbon` (and `@iconify-json/material-icon-theme`
if it uses the Google icon), because a layer's own dependencies are not installed for the consumer.

### What the app provides

`app/app.config.ts`:

```ts
export default defineAppConfig({
	ui: { colors: { primary: 'orange' } },       // v4 orange, SBDA 'blue'; any other colour key overrides the same way
	app: {
		name: 'Central',                         // big wordmark line
		company: 'Fluxcon',                      // small line above it, and the footer copyright; '' hides the small line
		home: '/',                               // logo link
		storageKey: 'central-dashboard',         // sidebar state in localStorage; unique per app
		nameClass: 'text-[12cqi] tracking-widest', // optional; cqi = % of the wordmark column width; SBDA uses 'text-base tracking-normal'
		icon: { color: 'primary', legs: [45, 135] }, // this app's BrandIcon variant, logo and favicon; see below
		nav: [
			{ label: 'Dashboard', icon: 'carbon:workspace', to: '/' },
			{ label: 'Accounts', type: 'label' },
			{ label: 'Accounts', icon: 'carbon:business-processes', to: '/accounts', match: '/account' },
		],
	},
});
```

- `nav` items are Nuxt UI `NavigationMenuItem`s plus `match`: `'exact'` or a path prefix. Default is exact for `/`, else
  prefix of `to`. An explicit `active` always wins. Label items (`type: 'label'`) pass through. The type is
  `import type { AppNavItem } from '#central-ui'`.
- `match` sees only the path. Items that differ by query string (IWS's "Call log" `/admin/calls` and "Unknowns"
  `/admin/calls?outcome=unknown`) need an app layout that sets `active` itself; see "Dynamic nav" below.
- **Brand icon**: every app shows the same mark, a ring with a centre dot, in its own primary colour, cut by different
  legs so users can tell the apps apart at a glance. Set it once in `app.icon`; the sidebar logo and `/favicon.svg` both
  read it. `color` is a Nuxt UI colour key and stays `'primary'`, so the icon follows `ui.colors.primary`. `legs` are up
  to three angles in degrees, clockwise from north; missing legs repeat the last one, so two angles draw a two-legged
  icon, and none draws three at 0/120/240. central-v4 uses `[45, 135]`. Pick angles no other app uses.
  Arrays in app config concatenate with the layer's, which is why the layer leaves `legs` (and `nav`) empty.
- **Favicon**: the layer adds `<link rel="icon" href="/favicon.svg">`, served from `app.icon` with the 500 shade in light
  mode and 400 in dark (Nuxt UI's primary). Delete the app's own `public/favicon.svg` and its `link`: a static file at
  that path wins over the route. Browsers cache favicons hard (the route sends a 1-day `max-age`).
- To show the icon elsewhere (login, empty states), use `<BrandIcon color="primary" :legs="[45, 135]" />`.
- The app still owns `app.head.title`, its pages, login, auth and middleware.
- Extra colour aliases (v4's `fluxcon`, `global`, `terrace`): add them to `ui.theme.colors` in the app's `nuxt.config.ts`
  (arrays merge with the layer's) and map them in the app's `app.config.ts`.
- **Dynamic nav or footer buttons** (SBDA's per-permission nav and sign-out button): write your own `app/layouts/default.vue`:
  `<AppShell :items="links"><template #footer-actions><UButton .../></template><slot /></AppShell>`.
- **Pages**: wrap each page in `PagePanel` instead of writing `UDashboardPanel` + navbar + toolbar by hand:
  ```vue
  <PagePanel id="account" :title="`Manage: ${name}`" :breadcrumbs="[
  	{ label: 'Dashboard', icon: 'carbon:workspace', to: '/' },
  	{ label: 'Accounts', icon: 'carbon:building', to: '/accounts' },
  	{ label: name, icon: 'carbon:store' },
  ]">
  	<template #right><UserCard ... /></template>
  	<template #actions><UButton label="Edit" /></template>
  	<!-- page body -->
  </PagePanel>
  ```
  The back chevron appears only from two path levels below `app.home` (`/account/30389`; with IWS's home `/admin`,
  `/admin/calls/5` but not `/admin/calls`) and links to the second-to-last crumb, so give a deep page breadcrumbs.
  The toolbar renders only with breadcrumbs or `#actions`. `ui` passes through to `UDashboardPanel`; the body
  already has v4's `scrollbar-gutter-stable pr-2!`, and a `body` you pass adds to it. Don't add a
  `UDashboardSidebarCollapse` to the navbar: the sidebar footer has one.
- User menu: `<UserCard :name :email :image profile @logout="signOut" />` in `PagePanel`'s `#right` slot; the app does the
  sign-out. Each app writes a small component that feeds its session into `UserCard` (IWS's `AdminUser`): it is auth code.
- **Login**: the page is the app's (`definePageMeta({ layout: false })`); wrap its card in `LoginBackdrop`:
  `<LoginBackdrop><UCard ...><BrandLogo /> <form ...></UCard></LoginBackdrop>` (`color="blue"` for SBDA).
- **BrandLogo outside the sidebar**: the wordmark is sized in `cqi` of its column. In a shrink-to-fit parent it falls
  back to a 12.5rem column (v4's 24px login wordmark); give the logo a width (`class="mx-auto w-52"`) to size it.

## Left out, and why

- **Login page**: v4, SBDA and IWS each have their own, all welded to better-auth `authClient` with different flows
  (Google, forgot-password, reset notice, `/admin/login`). Only the backdrop is shared: `LoginBackdrop`.
- **Time formatting** (IWS's `fmtTime`, `sv-SE`): v4 uses relative times and `en-GB` dates, SBDA `Intl` medium styles.
  No two apps format alike.
- **Company badge colours** (`fluxcon`, `global`, `terrace`): v4 domain data. Left to v4.
- **`material-icon-theme:google`** from the icon bundle: only the Google login button uses it; v4 adds it to its own
  `icon.clientBundle.icons`.
- **Head title, runtimeConfig, `ssr`, nitro preset**: per app.
- `useStockPlace`, `format-phone-number`, `audit-actions`, `tag-case`, `stock-tree`, `account-match`, `auth-client`,
  `auth.global` middleware, `error.vue`: v4 domain or auth.

## Versioning

Consumers pin a tag. Changes land on `main`, get a tag (`v0.x.y`), and an app adopts them by bumping its pinned tag.
Never extend `#main`.

## Develop

`pnpm install`, then `pnpm dev` (playground on :3000, or `pnpm portless:dev` for `https://ui.localhost`), `pnpm build`,
`pnpm check` (vue-tsc + eslint). The playground home is a dashboard demo; its table IDs open `/activations/:id`, the
two-level page that shows `PagePanel`'s back button. `/login` shows `LoginBackdrop` with v4's card (`?color=blue` for
SBDA's). `tsconfig.json` is left out of exports (`.gitattributes`): it points at the playground's generated `.nuxt`,
which a `github:` download lacks.

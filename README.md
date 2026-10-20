# central-ui-layer

Nuxt 4 layer holding the shared design of central-v4, extracted without changes: Nuxt UI v4 setup, Carbon icons,
toast/link/button variants, the sidebar dashboard shell, and a few pure-UI composables. central-v4, SBDActivate v2 and
IWS proxy v2 `extends:` it instead of copying.

## What is in it

| Path | What |
|---|---|
| `nuxt.config.ts` | `@nuxt/ui` + `@nuxt/eslint`, `main.css`, icon clientBundle, `ui.theme.colors` (9 semantic colours), `lang`/viewport head |
| `app/app.config.ts` | v4's `ui` defaults (colours with **primary = orange**, Carbon icons, link/button/toast variants) and the `app` shell defaults |
| `app/assets/css/main.css` | fonts (Noto), green palette, `touch`/`no-touch` variants, `--ui-full-header-height`, `shake` animation |
| `app/app.vue` | `UApp` (toaster top-centre), loading indicator, `NuxtLayout` |
| `app/layouts/default.vue` | renders `AppShell` with `app.nav` |
| `app/components/AppShell.vue` | sidebar dashboard shell (props: `items`; slots: `footer-actions`, default) |
| `app/components/BrandLogo.vue` | logo + wordmark, from `app.company` / `app.name` / `app.home` / `app.nameClass` |
| `app/components/UserCard.vue` | colour-mode toggle + user menu. Props `name`, `email`, `image`, `profile`; emits `logout`, `profile` |
| `app/composables/` | `useAppToast`, `useDebounced`, `useLocalStorage` |
| `app/utils/api-error.ts` | `apiErrorMessage` (h3 error body to toast text) |

## Using it

```ts
// nuxt.config.ts
extends: ['../central-ui-layer']                                // local checkout
extends: ['github:Fluxcon/central-ui-layer#v0.1.0']             // pinned tag; private repo needs GIGET_AUTH=<token>
```

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
		nameClass: 'text-2xl tracking-widest',   // optional; SBDA uses 'text-base tracking-normal'
		nav: [
			{ label: 'Dashboard', icon: 'carbon:workspace', to: '/' },
			{ label: 'Accounts', type: 'label' },
			{ label: 'Accounts', icon: 'carbon:business-processes', to: '/accounts', match: '/account' },
		],
	},
});
```

- `nav` items are Nuxt UI `NavigationMenuItem`s plus `match`: `'exact'` or a path prefix. Default is exact for `/`, else
  prefix of `to`. An explicit `active` always wins. Label items (`type: 'label'`) pass through.
- Arrays in `app.nav` replace the layer's (empty) default, so list everything.
- The app still owns `app.head.title` and the favicon (`public/favicon.svg`), its pages, login, auth and middleware.
- Extra colour aliases (v4's `fluxcon`, `global`, `terrace`): add them to `ui.theme.colors` in the app's `nuxt.config.ts`
  (arrays merge with the layer's) and map them in the app's `app.config.ts`.
- **Dynamic nav or footer buttons** (SBDA's per-permission nav and sign-out button): write your own `app/layouts/default.vue`:
  `<AppShell :items="links"><template #footer-actions><UButton .../></template><slot /></AppShell>`.
- User menu: `<UserCard :name :email :image profile @logout="signOut" />` in a navbar `#right` slot; the app does the sign-out.

## Left out, and why

- **Login page**: v4, SBDA and IWS each have their own, all welded to better-auth `authClient` with different flows
  (Google, forgot-password, reset notice, `/admin/login`). Only the orange gradient backdrop is shared; extract a
  `LoginBackdrop` later if wanted.
- **Company badge colours** (`fluxcon`, `global`, `terrace`): v4 domain data. Left to v4.
- **`material-icon-theme:google`** from the icon bundle: only the Google login button uses it; v4 adds it to its own
  `icon.clientBundle.icons`.
- **Head title, favicon, runtimeConfig, `ssr`, nitro preset**: per app.
- `useStockPlace`, `format-phone-number`, `audit-actions`, `tag-case`, `stock-tree`, `account-match`, `auth-client`,
  `auth.global` middleware, `error.vue`: v4 domain or auth.

## Versioning

Consumers pin a tag. Changes land on `main`, get a tag (`v0.x.y`), and an app adopts them by bumping its pinned tag.
Never extend `#main`.

## Develop

`pnpm install`, then `pnpm dev` (playground on :3000), `pnpm build`, `pnpm check` (vue-tsc + eslint).

# central-ui-layer

Nuxt 4 layer with central-v4's shared design, consumed by central-v4, SBDActivate v2 and IWS proxy v2 via `extends:`.
README.md documents the consumer contract (`app.*` config keys, slots).

## Commands

- `pnpm install`, `pnpm dev` (playground), `pnpm portless:dev` (playground at `https://ui.localhost`), `pnpm build` (playground build), `pnpm check` (vue-tsc + eslint)

## Rules

- Generic only: no domain code, no auth client, no per-app copy. Nothing goes in unless at least two apps use it.
- Look is v4's; a design change is its own release and is called out in the tag notes.
- Layer-internal imports are relative (`../types/...`); `~` resolves to the consuming app.
- Tag every release (`vX.Y.Z`). Consumers pin tags; never tell an app to extend `#main`.
- Keep the playground working: it is the only visual check. Compare against v4 running at `https://central.localhost`.

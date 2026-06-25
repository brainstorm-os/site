# Brainstorm — Website

The marketing site for [Brainstorm](https://github.com/brainst0rm-os/shell), the local-first knowledge OS — live at **[getbrainstorm.online](https://getbrainstorm.online)**.

Built with [Astro](https://astro.build): static-first, with zero client-side JavaScript above the fold and an optional 3D hero scene that gracefully degrades on reduced-motion and low-power devices.

## Develop

```sh
bun install
bun run dev          # astro dev server (port 4321)
bun run build        # static build to dist/
bun run preview      # serve the production build locally
bun run typecheck    # astro check + tsc --noEmit
bun run lint         # biome check
bun run format       # biome format --write
```

## License

[MIT](LICENSE) © Brainstorm

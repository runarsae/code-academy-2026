---
applyTo: '4-Frontend/kaffebar-web/**'
---

- Les `node_modules/next/dist/docs/` før du bruker Next.js-API-er (se `4-Frontend/kaffebar-web/AGENTS.md`). Denne versjonen har breaking changes, så ikke bruk API-er fra hukommelsen.
- Datahenting: bruk TanStack Query (`@tanstack/react-query`). Ikke hent data i `useEffect`.
- API-typer: generer med `yarn generate:types`. Rediger aldri `src/types/kaffebar.ts` for hånd.
- Ikke lagre tokens i `localStorage`. BFF-et holder dem på serversiden, og `KAFFEBAR_API_URL` er en serverhemmelighet.
- Ikke innfør et ekstra stylingsystem i web-appen.
- Ruter under `src/app/api` følger BFF-mønsteret: `/api/orders/**` proxyer til Kaffebar-API-et via funksjoner i `src/lib/api.ts`.
- Ikke rediger `*-solution`-filer (f.eks. `useEventSource-solution.ts`) og ikke kopier løsningskode inn i startermalen uten at du blir bedt om det.
- Kommandoer fra `4-Frontend/kaffebar-web`: `yarn test`, `yarn lint`, `yarn build`.

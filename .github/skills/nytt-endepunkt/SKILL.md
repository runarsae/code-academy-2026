---
name: nytt-endepunkt
description: Lager nye REST-endepunkter (Next.js route handlers som BFF) i 4-Frontend/kaffebar-web etter repoets eksisterende mønster. Bruk når du skal legge til, utvide eller endre en rute under src/app/api, f.eks. "lag et endepunkt for ...".
---

# Nytt endepunkt i kaffebar-web

Alle kommandoer kjøres fra `4-Frontend/kaffebar-web`. Mønsteret finnes i `src/app/api/orders/route.ts`, `src/app/api/orders/[orderId]/route.ts` og `src/app/api/customers/active/route.ts`.

## Steg

1. Les `node_modules/next/dist/docs/` (se `AGENTS.md`) om route handlers før du skriver kode. Denne Next.js-versjonen har breaking changes, så ikke stol på hukommelsen.
2. Sjekk om typene finnes i `src/types/domain.ts`. Hvis API-et har endret seg, kjør `yarn generate:types`. Rediger aldri `src/types/kaffebar.ts` for hånd.
3. Hvis endepunktet snakker med Kaffebar-API-et, legg en funksjon i `src/lib/api.ts` (som `fetchOrders`, `createOrder`, `updateOrderStatus`). Ruta kaller denne, aldri `fetch` mot API-et direkte. `KAFFEBAR_API_URL` skal forbli en serverhemmelighet.
4. Legg ren forretningslogikk i en egen funksjon i `src/lib/` (som `activeCustomers` i `customers.ts`), slik at den kan enhetstestes uten HTTP.
5. Opprett `src/app/api/<ressurs>/route.ts`. Dynamiske segmenter bruker `[param]/route.ts`, og `params` hentes med `await context.params`.
6. Eksporter `export const dynamic = "force-dynamic";` og én funksjon per HTTP-metode (`GET`, `POST`, `PATCH`, ...) med `NextRequest` / `NextResponse` fra `next/server`.
7. Pakk kall i `try/catch` og svar med `NextResponse.json({ message }, { status })`. Meldingen hentes med `error instanceof Error ? error.message : "Ukjent feil"`. Bruk 502 når oppstrøms-API-et feiler, 400 ved ugyldig input, og 201 ved opprettelse.
8. Ikke lagre tokens i `localStorage`. BFF-et holder dem på serversiden.
9. Hvis frontend skal bruke endepunktet, bruk TanStack Query (`useQuery` / `useMutation`) i en hook i `src/hooks/`. Ikke hent data i `useEffect`.
10. Skriv en Vitest-test i `__tests__/` (se `customers.test.ts`) for logikken du la til. Skriv kommentarer og tekster på norsk.
11. Kjør testene og lint: `yarn test` og `yarn lint`. Fiks eventuelle feil før du er ferdig. For én enkelt test: `yarn vitest run __tests__/<fil>.test.ts -t "navn"`.

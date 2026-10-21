# Copilot Instructions

Norwegian-language workshop monorepo. Each numbered folder is one session; task docs (`oppgave(r).md`, `FASIT.md`) are in Norwegian. Write new docs, comments and user-facing strings in Norwegian.

## Architecture

- `1-DevOps/idempotweet` — Next.js + Postgres. `src/lib/db.ts` is the data layer; `src/lib/rabbitmq.ts` publishes `idem.created` when `ENABLE_RABBITMQ=true`.
- `2-EventDriven/dotnet-consumer` — `Common` (`ConnectionHelper`), `Consumer`, `Consumer-2`, `Producer`, `Infrastructure` (EF Core).
- `3-APIs/kaffebar-dotnet[-solution]` — code-first .NET 10 API; publishes order events to RabbitMQ exchange `kaffebar`.
- `4-Frontend/kaffebar-web` — Next.js BFF. Browser ← `/api/events` (SSE) ← RabbitMQ; `/api/orders/**` proxies to the Kaffebar API.
- Root `docker-compose.yml` is profile-based; `rabbitmq` always runs. Inside the network the API alias is `kaffebar-api`.

## Commands (run from the folder given)

| What | Folder | Command |
|---|---|---|
| Build .NET API | `3-APIs/kaffebar-dotnet-solution` | `dotnet build Kaffebar.slnx` |
| Test .NET API | same | `dotnet test Kaffebar.slnx` |
| Single .NET test | same | `dotnet test Kaffebar.Tests --filter "FullyQualifiedName~TestName"` |
| Build consumers | `2-EventDriven/dotnet-consumer` | `dotnet build DotnetEvents.slnx` |
| Test web / idempotweet | `4-Frontend/kaffebar-web`, `1-DevOps/idempotweet` | `yarn test` |
| Single JS test | same | `yarn vitest run path/to/file.test.ts -t "name"` |
| Lint JS | same | `yarn lint` |
| Build JS | same | `yarn build` |

There is no lint step for .NET.

## Rules

**Libraries and helpers — use these**
- .NET errors: build every error response with `ProblemFactory` (`Kaffebar/Errors/ProblemFactory.cs`) and return it via `.AsResult()` (`application/problem+json`). Never hand-write error JSON.
- .NET DTOs: use `record` types, with separate request and response types.
- .NET API tests: use `WebApplicationFactory<Program>` over HTTP (see `KaffebarApiTests`); don't call controller methods directly.
- .NET RabbitMQ connection: use `ConnectionHelper.ConnectAsync()` from `Common`; config via `RabbitMQ:URI` / `RabbitMQ__URI`.
- Frontend data fetching: use TanStack Query (`@tanstack/react-query`). Don't fetch in `useEffect`.
- Frontend API types: generate with `yarn generate:types`.
- Frontend tests: Vitest.

**Forbidden**
- Don't edit `src/types/kaffebar.ts` by hand; regenerate it.
- Don't store tokens in `localStorage`; the BFF holds them server-side.
- Don't remove the Minimal API `GET /menu` next to `OrdersController`; the mix is intentional.
- Don't edit `*-solution` files (e.g. `Dockerfile-solution`, `useEventSource-solution.ts`, `ci-solution.yml`) when working on the matching starter, and don't copy solution code into starters unless asked.
- Don't commit `.env` or secrets.
- Don't add a second styling system to the web app.
- Don't use Next.js APIs from memory: this version has breaking changes. Read `node_modules/next/dist/docs/` first (`4-Frontend/kaffebar-web/AGENTS.md`).

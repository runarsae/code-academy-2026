---
applyTo: '**/Kaffebar.Tests/**,**/__tests__/**'
---

- .NET API-tester: bruk `WebApplicationFactory<Program>` over HTTP (se `KaffebarApiTests`). Ikke kall kontrollermetoder direkte.
- JS-tester (kaffebar-web og idempotweet): bruk Vitest.
- Test ren forretningslogikk i egne funksjoner (se `__tests__/customers.test.ts`), slik at den kan testes uten HTTP.
- Kjør én .NET-test: `dotnet test Kaffebar.Tests --filter "FullyQualifiedName~TestName"` fra `3-APIs/kaffebar-dotnet-solution`.
- Kjør én JS-test: `yarn vitest run path/to/file.test.ts -t "navn"`.
- Skriv testnavn og kommentarer på norsk.

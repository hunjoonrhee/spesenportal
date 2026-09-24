# ADR-0002: REST-API mit OpenAPI als Vertrag

- Status: akzeptiert (Sprint 2)
- Beteiligte: Markus Weber, Sabine Keller

## Kontext
Frontend und Backend werden parallel entwickelt. Das Team braucht eine gemeinsame, prüfbare Beschreibung der API.

## Entscheidung
- REST unter `/api`, JSON, deutschsprachige Fehlermeldungen.
- OpenAPI-Dokumentation über `@nestjs/swagger` unter `/api/docs`. Sie ist Teil der Definition of Done bei API-Änderungen.
- Listen-Endpunkte liefern `{ items, page, pageSize, total }`.

## Konsequenzen
- API-Änderungen werden im Refinement besprochen und im Kanal #backend angekündigt.
- Die Frontend-Modelle werden derzeit von Hand gepflegt (keine Code-Generierung).

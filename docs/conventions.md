# Konventionen

## Branches
`EXP-123-kurze-beschreibung`, abgezweigt von `main`. Routinen des BE-Teams erzeugen `claude/EXP-123-...`.

## Commits
Conventional Commits mit Ticketnummer:
- `feat(expenses): filter list by status (EXP-58)`
- `fix(expenses): count total after filtering (EXP-66)`
- `test(approvals): cover reject without reason (EXP-60)`

## Pull Requests
- Titel: `EXP-123: Kurzbeschreibung`. Das BE-Team verwendet `[BE] EXP-123: ...`.
- Vorlage ausfüllen, besonders den Abschnitt **Entscheidungen / Trade-offs**.
- Automatische Reviews: Änderungen in `frontend/` → Sabine, in `backend/` → Markus. Weitere Fragen im PR mit `@jonas`.
- PRs des BE-Teams reviewt Joon.
- Gemergt wird nach mindestens einem Review ohne offene „Muss“-Punkte. Squash-Merge.

## Definition of Done
- Akzeptanzkriterien erfüllt und im Browser geprüft
- `npm test` grün, neues Verhalten ist getestet
- Keine neuen `any`-Typen
- Swagger aktualisiert bei API-Änderungen, Ankündigung in #backend
- Jira-Ticket verlinkt und auf „Done“

## Code-Stil
- Prettier ist in beiden Projekten eingerichtet.
- Frontend: Signals für Zustand, Typen aus `core/models.ts`, Texte auf Deutsch.
- Backend: DTOs mit class-validator, Fehlermeldungen auf Deutsch, Imports mit `.js`-Endung (ESM).

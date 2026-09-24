# ADR-0003: In-Memory-Persistenz in der MVP-Phase

- Status: akzeptiert, befristet (Sprint 1)
- Beteiligte: Markus Weber, Katrin Schulz, Lena Vogel

## Kontext
Für die ersten Sprints zählt Tempo. Eine Datenbank würde Setup, Migrationen und Infrastruktur erfordern.

## Entscheidung
Seed-Daten liegen als JSON in `backend/data/` und werden beim Start in den Speicher geladen (`DataStoreService`). Der Generator ist `scripts/generate-seed.mjs`.

## Konsequenzen
- Alle Änderungen gehen beim Neustart verloren.
- Keine Transaktionen, keine Nebenläufigkeitskontrolle.
- Ablösung ist als EXP-73 im Backlog. Dafür wird ein neues ADR benötigt.

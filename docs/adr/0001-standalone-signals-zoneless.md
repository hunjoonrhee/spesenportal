# ADR-0001: Standalone Components, Signals und Zoneless

- Status: akzeptiert (Sprint 1, Zoneless ergänzt in Sprint 7)
- Beteiligte: Sabine Keller, Jonas Fischer

## Kontext
Neues Frontend ohne Altlasten. Das Team wollte keine NgModules pflegen und die aktuelle Reaktivität von Angular nutzen.

## Entscheidung
- Nur Standalone Components, lazy geladene Routen.
- Lokaler und abgeleiteter Zustand mit Signals (`signal`, `computed`, `input`).
- Seit Sprint 7 ohne zone.js (Zoneless Change Detection).
- RxJS bleibt für HTTP und Ereignisströme erlaubt.

## Konsequenzen
- Änderungen am Zustand müssen über Signals, `async`-Pipe oder Resource-APIs laufen, sonst aktualisiert sich die Ansicht nicht.
- Ein einheitliches Muster für Datenladen ist noch nicht festgelegt. Offene Frage fürs Team.

# ADR-0005: Kostenstellen flach ausliefern, Baum im Client

- Status: akzeptiert (Sprint 2)
- Beteiligte: Markus Weber, Sabine Keller

## Kontext
Kostenstellen bilden eine Hierarchie (z. B. 1000 → 1100 → 1110). Mehrere Ansichten brauchen sie unterschiedlich: als Liste im Formular, als Baum in der Buchhaltung.

## Entscheidung
`GET /api/cost-centers` liefert eine flache Liste mit `parentId`. Baumdarstellungen und Summen über Teilbäume baut der Client.

## Konsequenzen
- Einfache API, flexible Darstellung.
- Die Baumlogik (rekursiv) liegt im Frontend. Wenn Summen über Teilbäume serverseitig nötig werden (EXP-72), wird die Entscheidung neu bewertet.

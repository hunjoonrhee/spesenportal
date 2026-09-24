# Sprint 8 (28.09.–11.10.2026) – Planungsvorschlag

**Sprint-Ziel (Entwurf):** Joon ist im Team angekommen, und „Meine Ausgaben“ zeigt korrekte und filterbare Daten.

## Kapazität
- Joon: 12 h, davon ca. 3 h Events und 2 h Onboarding → ca. 7 h für Tickets
- BE-Team (Katrin, Tim): über die Routine Di/Fr

## Vorschlag für Joon (FE : BE ≈ 70 : 30)

| Ticket | Typ | Bereich | SP | Hinweis |
|---|---|---|---|---|
| EXP-61 | Bug | Frontend | 1 | Guter erster Durchlauf von Branch bis Merge |
| EXP-66 | Bug | Backend | 2 | Vor EXP-58 erledigen (gleiche Methode) |
| EXP-58 | Story | Fullstack | 3 | API-Filter + Status-Chips + URL-Zustand |
| EXP-63 | Story | Frontend | 1 | Stretch |

## Vorschlag für das BE-Team

| Ticket | SP | Wer |
|---|---|---|
| EXP-60 | 3 | Katrin |
| EXP-67 | 2 | Tim |

## Risiken
- EXP-66, EXP-58 und EXP-67 ändern alle `ExpensesService` bzw. dessen Controller. Reihenfolge im Planning festlegen, Merge-Konflikte einplanen.

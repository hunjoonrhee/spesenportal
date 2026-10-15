# ADR-0006: Listenzustand (Filter, Sortierung, Seite) in der URL

- Status: **Entwurf** (Refinement 14.10.2026, gilt ab EXP-74)
- Beteiligte: Joon, Sabine Keller, Jonas Fischer, Lena Vogel (UX-Entscheidungen)
- Bezug: EXP-74, EXP-58, EXP-54, EXP-53; ADR-0001

## Kontext
„Meine Ausgaben“ bekommt mehrere Filter (Status EXP-58, Kategorie EXP-54, Suche EXP-53) sowie Sortierung und Paginierung. Nutzer:innen sollen einen Link auf die gefilterte Liste speichern oder teilen können. Nach Neuladen oder Zurück/Vorwärts soll dieselbe Ansicht erscheinen (EXP-74).

Bisher hält die Komponente diesen Zustand in eigenen Feldern (z. B. `sortAsc`, `page`). Die URL enthält nichts davon, deshalb geht der Zustand beim Neuladen verloren. Weitere Filter würden das Problem pro Ansicht vervielfachen. Die AC von EXP-74 verlangen deshalb ein gemeinsames URL-Schema für alle Listenansichten.

## Entscheidung
1. **Die URL ist die Quelle des Listenzustands.** Der Datenfluss geht in eine Richtung: Interaktion → URL → Ansicht. Beim Neuladen und bei Zurück/Vorwärts wird der Zustand aus der URL gelesen.
2. **Nur ein Service kennt das URL-Schema.** Er übernimmt Schlüsselnamen, Parsing, Validierung, Standardwerte und das Format für Mehrfachwerte. Komponenten lesen und schreiben Query-Parameter nicht direkt. Sie lesen einen typisierten Zustand als Signal und melden Änderungen an den Service. Der Service ist nicht an „Meine Ausgaben“ gebunden.
3. **Werte nutzen das API-Vokabular.** Beispiele: `sort=date&order=asc`, `status=SUBMITTED`, Kategorie-`key` wie `category=HOTEL`. Werte, die dem Standard entsprechen, entfallen in der URL.
4. **Ungültige oder veraltete Werte** werden ignoriert bzw. durch Standardwerte ersetzt; die Liste wird trotzdem angezeigt.
5. **Browserverlauf** (Entscheidung Lena): Änderungen an Filtern und Sortierung ersetzen den aktuellen Eintrag (`replaceUrl`). Ein Seitenwechsel erzeugt einen neuen Eintrag.

Noch offen:
- Darstellung von Mehrfachwerten (Schlüssel wiederholen oder kommagetrennt). Wird mit EXP-58 festgelegt.
- Ob der Suchbegriff in die URL darf (DSGVO, Klärung durch Lena vor EXP-53).

## Betrachtete Alternativen
| Option | Vorteile | Nachteile | Passend wenn |
|---|---|---|---|
| **A. URL als Quelle** (gewählt) | Ein Datenfluss in eine Richtung. URL und Zustand können nicht auseinanderlaufen. Zurück/Vorwärts funktioniert ohne Zusatzaufwand. | Werte sind Strings und brauchen Parsing, Validierung und Standardwerte. Eine Regel für den Browserverlauf ist nötig. | Fast der ganze Zustand lässt sich in der URL abbilden, und eine Ansicht besitzt ihn. |
| B. Signal-Service als Quelle, URL als Spiegel | Typisierter Zustand in der App. Auch Zustand ohne URL-Bezug ist möglich. | Synchronisation in beide Richtungen ist nötig, URL und Zustand können auseinanderlaufen. Zurück/Vorwärts muss eigens behandelt werden. | Viel Zustand gehört nicht in die URL, oder mehrere Ansichten teilen ihn. |
| Query-Parameter direkt in der Komponente | Am wenigsten Code. | Das Schema verteilt sich auf viele Stellen; AC 3 von EXP-74 wäre schwer einzuhalten. | Eine einmalige Ansicht ohne weitere Filter. |

## Konsequenzen
<!-- TODO Joon: Bitte ausfüllen, gern auf Deutsch oder zunächst auf Koreanisch.
     Leitfragen:
     - Was wird durch diese Entscheidung einfacher? (z. B. Tests, Fehlersuche, neue Filter)
     - Was wird schwieriger oder kostet uns etwas? (z. B. Parsing und Validierung, Regel für den Browserverlauf, Router-Abhängigkeit)
     - Welche Trade-offs gehen wir bewusst ein, und wann sollten wir die Entscheidung neu prüfen? (z. B. bei der Genehmigungsübersicht EXP-55 oder wenn mehrere Ansichten Zustand teilen)
     - Was bedeutet das für bestehende Komponenten (Formular, Detailansicht) im Sinne einer Teamregel? -->

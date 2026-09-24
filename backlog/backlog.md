# Produkt-Backlog Spesenportal

Quelle der Wahrheit ist Jira. Diese Datei ist der Import-Stand vom Start von Sprint 8.
Labels: `frontend`, `backend`, `fullstack` = für Joon möglich · `team-be` = BE-Team (Katrin, Tim) · `refined` = bereit für Planning

## Epics

- **EXP-1 Spesen erfassen**: Mitarbeitende erfassen Ausgaben, speichern Entwürfe und reichen sie ein.
- **EXP-2 Übersicht & Suche**: Mitarbeitende finden ihre Ausgaben schnell: Liste, Sortierung, Filter, Suche.
- **EXP-3 Genehmigungsworkflow**: Kostenstellenverantwortliche prüfen, genehmigen oder lehnen Einreichungen ab.
- **EXP-4 Auswertung & Dashboard**: Überblick über Ausgaben nach Kategorie, Zeitraum und Kostenstelle.
- **EXP-5 Kostenstellen**: Darstellung und Auswertung der Kostenstellenhierarchie.
- **EXP-6 Belege**: Belege hochladen, anzeigen und prüfen.
- **EXP-7 Plattform & Qualität**: Technische Grundlagen: Auth, Persistenz, Fehlerbehandlung, Barrierefreiheit.

## Offene Einträge

### EXP-53 · Spesenliste: Freitextsuche nach Beschreibung
Story · Epic EXP-2 · nicht geschätzt · frontend

Als Mitarbeiter:in möchte ich meine Ausgaben nach einem Stichwort in der Beschreibung durchsuchen.

### EXP-54 · Spesenliste nach Kategorie filtern
Story · Epic EXP-2 · nicht geschätzt · fullstack

Als Mitarbeiter:in möchte ich meine Ausgaben nach Kategorie filtern.

### EXP-55 · Genehmigungsübersicht für Kostenstellenverantwortliche
Story · Epic EXP-3 · 5 SP · frontend, refined

Als Kostenstellenverantwortliche:r möchte ich alle offenen Einreichungen meiner Kostenstellen sehen, damit ich nichts übersehe.

Akzeptanzkriterien:
- Neuer Menüpunkt „Zu genehmigen“ nur für die Rolle APPROVER sichtbar
- Liste zeigt Mitarbeiter:in, Datum, Beschreibung, Betrag in EUR und Kostenstelle
- Datenquelle: GET /api/approvals/pending
- Leerer Zustand: „Keine offenen Einreichungen“

### EXP-56 · Ausgabe aus der Genehmigungsübersicht genehmigen
Story · Epic EXP-3 · 3 SP · frontend, refined

Als Kostenstellenverantwortliche:r möchte ich eine Einreichung direkt aus der Übersicht genehmigen.

Akzeptanzkriterien:
- Button „Genehmigen“ pro Zeile ruft POST /api/approvals/{id}/approve auf
- Nach Erfolg verschwindet die Zeile aus der Liste
- Fehler werden verständlich angezeigt (kein stilles Scheitern)

### EXP-57 · Entwurf bearbeiten
Story · Epic EXP-1 · 3 SP · frontend, refined

Als Mitarbeiter:in möchte ich einen gespeicherten Entwurf bearbeiten, bevor ich ihn einreiche.

Akzeptanzkriterien:
- In der Detailansicht eines Entwurfs gibt es „Bearbeiten“
- Das Formular ist mit den Werten des Entwurfs vorbefüllt
- Speichern ruft PATCH /api/expenses/{id} auf
- Nur Entwürfe sind bearbeitbar

### EXP-58 · Spesenliste nach Status filtern
Story · Epic EXP-2 · 3 SP · fullstack, refined, sprint-8

Als Mitarbeiter:in möchte ich meine Ausgaben nach Status filtern, damit ich offene Einreichungen schnell finde.

Akzeptanzkriterien:
- Status-Chips oberhalb der Liste, Mehrfachauswahl möglich
- API: GET /api/expenses unterstützt Filter nach einem oder mehreren Status
- Anzahl und Paginierung beziehen sich auf die gefilterte Menge
- Kein Treffer: verständlicher leerer Zustand
- Filter bleibt nach einem Reload erhalten (URL-Query-Parameter)

### EXP-59 · Validierung im Erfassungsformular
Story · Epic EXP-1 · 2 SP · frontend, refined

Als Mitarbeiter:in möchte ich sofort sehen, was an meiner Eingabe falsch ist.

Akzeptanzkriterien:
- Betrag muss größer als 0 sein, maximal zwei Nachkommastellen
- Datum darf nicht in der Zukunft liegen
- Fehlermeldung direkt am jeweiligen Feld statt einer Sammelmeldung

### EXP-60 · API: Ausgabe mit Begründung ablehnen
Story · Epic EXP-3 · 3 SP · backend, team-be, refined, sprint-8

Als Kostenstellenverantwortliche:r möchte ich eine Einreichung mit Begründung ablehnen können.

Akzeptanzkriterien:
- POST /api/approvals/{id}/reject mit Body { reason }
- reason ist Pflicht, 5 bis 300 Zeichen
- Nur Status SUBMITTED kann abgelehnt werden
- Swagger-Doku ist aktualisiert

### EXP-61 · Spesenliste: Sortierung nach Datum ist falsch
Bug · Epic EXP-2 · 1 SP · frontend, refined, sprint-8

Nach Klick auf den Spaltenkopf „Datum“ stehen Ausgaben aus verschiedenen Monaten in falscher Reihenfolge (z. B. 02.09. vor 04.07. vor 07.06.).

Akzeptanzkriterien:
- Reproduktion: als Anna Becker anmelden, auf „Datum“ klicken
- Erwartet: chronologisch auf- bzw. absteigend
- Ein Test sichert das Verhalten ab

### EXP-62 · Ausgabe im UI ablehnen
Story · Epic EXP-3 · 3 SP · frontend, refined

Als Kostenstellenverantwortliche:r möchte ich in der Genehmigungsübersicht ablehnen und eine Begründung angeben.

Akzeptanzkriterien:
- Abhängig von EXP-60 und EXP-55
- Begründung über Vorschlagsliste oder Freitext
- Mitarbeiter:in sieht den Grund in der Detailansicht

### EXP-63 · Spesenliste: Lade- und Leerzustand
Story · Epic EXP-2 · 1 SP · frontend, refined, sprint-8

Als Mitarbeiter:in möchte ich erkennen, ob die Liste noch lädt oder wirklich leer ist.

Akzeptanzkriterien:
- Während des Ladens ist ein Ladezustand sichtbar
- Ohne Ausgaben: Hinweis mit Link „Ausgabe erfassen“

### EXP-64 · Dashboard: Ausgaben pro Kategorie im aktuellen Monat
Story · Epic EXP-4 · 5 SP · frontend, refined

Als Mitarbeiter:in möchte ich sehen, wofür ich in diesem Monat wie viel ausgegeben habe.

Akzeptanzkriterien:
- Neue Seite „Übersicht“ mit Summe je Kategorie in EUR, absteigend sortiert
- Gesamtsumme des Monats
- Monat umschaltbar (vorheriger/nächster)
- Offene Frage: Aggregation im Client oder neuer Endpunkt (siehe EXP-77)?

### EXP-65 · Kostenstellen als Baum anzeigen
Story · Epic EXP-5 · 5 SP · frontend, refined

Als Mitarbeiter:in der Buchhaltung möchte ich die Kostenstellenhierarchie als Baum sehen.

Akzeptanzkriterien:
- Datenquelle: GET /api/cost-centers (flach, mit parentId)
- Baum beliebig tief, Knoten auf- und zuklappbar
- Verantwortliche Person je Knoten sichtbar

### EXP-66 · API: total in der Paginierung zählt alle Ausgaben
Bug · Epic EXP-2 · 2 SP · backend, refined, sprint-8

GET /api/expenses liefert als total die Anzahl aller Ausgaben im System statt der eigenen. Anna sieht „152 Ausgaben insgesamt“ und 8 Seiten, ab Seite 3 sind die Seiten leer.

Akzeptanzkriterien:
- total entspricht der Anzahl der Treffer nach allen Filtern
- Unit-Test deckt den Fall ab

### EXP-67 · API: PATCH /expenses mit DTO und Validierung
Story · Epic EXP-7 · 2 SP · backend, team-be, refined, sprint-8

Der PATCH-Endpunkt nimmt aktuell beliebige Felder an. Er soll wie POST validieren.

Akzeptanzkriterien:
- UpdateExpenseDto mit denselben Regeln wie CreateExpenseDto, alle Felder optional
- Unbekannte Felder werden verworfen
- Tests für gültige und ungültige Änderungen

### EXP-68 · Beleg hochladen per Drag & Drop
Story · Epic EXP-6 · 8 SP · fullstack

Als Mitarbeiter:in möchte ich zu einer Ausgabe einen Beleg (PDF, JPG, PNG, max. 5 MB) hochladen. Zu groß für einen Sprint, bitte im Refinement schneiden.

### EXP-69 · CSV-Export für die Buchhaltung
Story · Epic EXP-4 · nicht geschätzt · fullstack

Als Buchhaltung möchte ich genehmigte Ausgaben eines Monats als CSV exportieren.

### EXP-70 · Monatsvergleich als Balkendiagramm (ohne Chart-Bibliothek)
Story · Epic EXP-4 · nicht geschätzt · frontend

Als Mitarbeiter:in möchte ich meine Ausgaben der letzten sechs Monate vergleichen.

### EXP-71 · Einheitliche Fehlerbehandlung im Frontend
Story · Epic EXP-7 · 3 SP · frontend, refined

HTTP-Fehler verschwinden aktuell stillschweigend. Nutzer:innen sollen verständliche Hinweise bekommen.

Akzeptanzkriterien:
- Zentrale Behandlung von HTTP-Fehlern (401, 403, 404, 400, 5xx)
- Validierungsfehler der API werden am Formular angezeigt
- Kein Button bleibt nach einem Fehler dauerhaft deaktiviert

### EXP-72 · Kostenstellen-Summen inklusive Unterkostenstellen
Story · Epic EXP-5 · 5 SP · fullstack

Als Kostenstellenverantwortliche:r möchte ich die Summe meiner Kostenstelle inklusive aller Unterkostenstellen sehen.

### EXP-73 · Persistenz: Datenbank statt In-Memory
Story · Epic EXP-7 · 8 SP · backend

Änderungen gehen beim Neustart verloren (ADR-0003). Welche Datenbank, welches Mapping, welche Migrationen? ADR erforderlich.

### EXP-74 · Filter- und Sortierzustand in der URL (Deep Links)
Story · Epic EXP-2 · 3 SP · frontend

Als Mitarbeiter:in möchte ich einen Link auf meine gefilterte Liste speichern können.

### EXP-75 · Spike: SSO-Anbindung (Entra ID)
Task · Epic EXP-7 · nicht geschätzt · fullstack

Ablösung der Demo-Authentifizierung (ADR-0004) vorbereiten.

### EXP-76 · Ausgaben zu einer Reise gruppieren
Story · Epic EXP-1 · 8 SP · fullstack

Als Mitarbeiter:in möchte ich mehrere Ausgaben einer Dienstreise zusammenfassen und gemeinsam einreichen.

### EXP-77 · API: Aggregations-Endpunkt nach Kategorie
Story · Epic EXP-4 · 3 SP · backend

Alternative zu clientseitiger Aggregation für EXP-64. Im Refinement abwägen.

### EXP-78 · Detailansicht zeigt Datum im ISO-Format
Bug · Epic EXP-1 · 1 SP · frontend, refined

Die Liste zeigt 02.09.2026, die Detailansicht 2026-09-02. Einheitlich deutsches Format.

Akzeptanzkriterien:
- Datum überall im Format TT.MM.JJJJ
- Eine zentrale Lösung statt Formatierung pro Komponente

### EXP-79 · Hinweis bei Genehmigung oder Ablehnung
Story · Epic EXP-3 · nicht geschätzt · frontend

Als Mitarbeiter:in möchte ich sehen, welche meiner Einreichungen sich seit meinem letzten Besuch geändert haben.

### EXP-80 · Barrierefreiheit von Tabelle und Formular
Story · Epic EXP-7 · 3 SP · frontend

Tastaturbedienung, Fokusreihenfolge, Labels und Screenreader-Texte prüfen und verbessern.

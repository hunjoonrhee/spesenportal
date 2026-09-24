"""Erzeugt backlog/jira-import.csv, backlog/backlog.md und backlog/sprint-history.md.
Wichtig: Die Zeilenreihenfolge entspricht den Jira-Schlüsseln EXP-1 ... EXP-n,
wenn die CSV in ein LEERES Jira-Projekt mit dem Schlüssel EXP importiert wird."""
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'backlog'

EPICS = [
    ('Spesen erfassen', 'Mitarbeitende erfassen Ausgaben, speichern Entwürfe und reichen sie ein.'),
    ('Übersicht & Suche', 'Mitarbeitende finden ihre Ausgaben schnell: Liste, Sortierung, Filter, Suche.'),
    ('Genehmigungsworkflow', 'Kostenstellenverantwortliche prüfen, genehmigen oder lehnen Einreichungen ab.'),
    ('Auswertung & Dashboard', 'Überblick über Ausgaben nach Kategorie, Zeitraum und Kostenstelle.'),
    ('Kostenstellen', 'Darstellung und Auswertung der Kostenstellenhierarchie.'),
    ('Belege', 'Belege hochladen, anzeigen und prüfen.'),
    ('Plattform & Qualität', 'Technische Grundlagen: Auth, Persistenz, Fehlerbehandlung, Barrierefreiheit.'),
]

# (sprint, epic_index 1-based, typ, summary, sp)
HISTORY = [
    (1, 7, 'Task', 'Projekt-Setup Angular (Standalone, SCSS, Vitest)', 3),
    (1, 7, 'Task', 'Projekt-Setup NestJS mit globalem Präfix /api', 2),
    (1, 7, 'Task', 'Seed-Daten-Generator für Nutzer, Kostenstellen, Kategorien, Ausgaben', 3),
    (1, 7, 'Story', 'Demo-Authentifizierung per Header X-Demo-User (ADR-0004)', 3),
    (1, 7, 'Task', 'Design-Tokens und Grundlayout', 2),
    (1, 7, 'Task', 'Root-Skripte: npm run dev / test / build', 1),
    (2, 1, 'Story', 'API: Kategorien abrufen', 1),
    (2, 5, 'Story', 'API: Kostenstellen als flache Liste abrufen (ADR-0005)', 2),
    (2, 2, 'Story', 'Spesenliste: Grundgerüst mit Tabelle', 3),
    (2, 2, 'Story', 'Status-Chip-Komponente', 2),
    (2, 7, 'Story', 'App-Shell mit Navigation und Nutzeranzeige', 3),
    (2, 7, 'Task', 'Swagger/OpenAPI-Doku unter /api/docs (ADR-0002)', 2),
    (3, 1, 'Story', 'API: Ausgaben lesen (eigene Ausgaben)', 3),
    (3, 2, 'Story', 'API: Paginierung und Sortierung für Ausgaben', 3),
    (3, 2, 'Story', 'Spesenliste: Paginierung im UI', 3),
    (3, 1, 'Story', 'API: Einzelne Ausgabe abrufen inkl. Berechtigungsprüfung', 2),
    (3, 7, 'Task', 'Demo-Login-Screen mit Nutzerauswahl nach Rolle', 3),
    (3, 7, 'Bug', 'Login: Nutzer nach Reload nicht mehr angemeldet', 1),
    (4, 1, 'Story', 'API: Ausgabe anlegen (Entwurf oder direkt einreichen)', 3),
    (4, 1, 'Story', 'Währungsumrechnung in EUR (feste Kurse)', 2),
    (4, 1, 'Story', 'Erfassungsformular: Grundgerüst', 5),
    (4, 1, 'Story', 'Erfassungsformular: eigene Kostenstelle vorauswählen', 1),
    (4, 7, 'Task', 'e2e-Tests für die API aufsetzen', 3),
    (4, 2, 'Bug', 'Spesenliste: Kategorie wird als ID angezeigt', 1),
    (5, 1, 'Story', 'API: Entwurf bearbeiten (PATCH)', 2),
    (5, 1, 'Story', 'API: Entwurf einreichen', 2),
    (5, 1, 'Story', 'Detailansicht einer Ausgabe', 3),
    (5, 1, 'Task', 'MoneyPipe für Beträge im deutschen Format', 1),
    (5, 1, 'Story', 'API: Entwurf löschen', 1),
    (5, 7, 'Task', 'ADR-0001 bis ADR-0003 nachdokumentiert', 1),
    (6, 3, 'Story', 'API: Offene Einreichungen für Kostenstellenverantwortliche', 3),
    (6, 3, 'Story', 'API: Ausgabe genehmigen', 3),
    (6, 7, 'Story', 'Rollenmodell: Mitarbeiter:in, Kostenstellenverantwortliche:r, Buchhaltung', 2),
    (6, 1, 'Story', 'Nur buchbare Kostenstellen (Blätter) im Formular anbieten', 2),
    (6, 2, 'Bug', 'Spesenliste: Tabelle auf Mobilgeräten nicht scrollbar', 1),
    (6, 7, 'Task', 'Unit-Tests ExpensesService', 2),
    (7, 7, 'Task', 'Umstellung auf Zoneless Change Detection (ADR-0001)', 3),
    (7, 1, 'Story', 'Detailansicht: Laden über Resource-API mit Lade- und Fehlerzustand', 2),
    (7, 7, 'Task', 'Upgrade auf Angular 22 und NestJS 12', 3),
    (7, 7, 'Task', 'Onboarding-Dokumentation für neue Teammitglieder', 2),
    (7, 3, 'Task', 'Spike: Ablehnungsprozess mit Fachbereich klären', 2),
    (7, 2, 'Story', 'Beträge in der Liste rechtsbündig mit Tabellenziffern', 1),
    (7, 7, 'Task', 'Stellenübergabe: Wissenstransfer vom bisherigen Junior-Entwickler', 2),
    (7, 7, 'Task', 'ADR-0004 und ADR-0005 nachdokumentiert', 1),
    (7, 3, 'Task', 'Ablehnungsgründe als Vorschlagsliste mit Fachbereich abgestimmt', 1),
]

# (key, epic, typ, summary, sp, labels, story_text, ac_list)
OPEN = [
    (53, 2, 'Story', 'Spesenliste: Freitextsuche nach Beschreibung', None, ['frontend'],
     'Als Mitarbeiter:in möchte ich meine Ausgaben nach einem Stichwort in der Beschreibung durchsuchen.', []),
    (54, 2, 'Story', 'Spesenliste nach Kategorie filtern', None, ['fullstack'],
     'Als Mitarbeiter:in möchte ich meine Ausgaben nach Kategorie filtern.', []),
    (55, 3, 'Story', 'Genehmigungsübersicht für Kostenstellenverantwortliche', 5, ['frontend', 'refined'],
     'Als Kostenstellenverantwortliche:r möchte ich alle offenen Einreichungen meiner Kostenstellen sehen, damit ich nichts übersehe.',
     ['Neuer Menüpunkt „Zu genehmigen“ nur für die Rolle APPROVER sichtbar',
      'Liste zeigt Mitarbeiter:in, Datum, Beschreibung, Betrag in EUR und Kostenstelle',
      'Datenquelle: GET /api/approvals/pending',
      'Leerer Zustand: „Keine offenen Einreichungen“']),
    (56, 3, 'Story', 'Ausgabe aus der Genehmigungsübersicht genehmigen', 3, ['frontend', 'refined'],
     'Als Kostenstellenverantwortliche:r möchte ich eine Einreichung direkt aus der Übersicht genehmigen.',
     ['Button „Genehmigen“ pro Zeile ruft POST /api/approvals/{id}/approve auf',
      'Nach Erfolg verschwindet die Zeile aus der Liste',
      'Fehler werden verständlich angezeigt (kein stilles Scheitern)']),
    (57, 1, 'Story', 'Entwurf bearbeiten', 3, ['frontend', 'refined'],
     'Als Mitarbeiter:in möchte ich einen gespeicherten Entwurf bearbeiten, bevor ich ihn einreiche.',
     ['In der Detailansicht eines Entwurfs gibt es „Bearbeiten“',
      'Das Formular ist mit den Werten des Entwurfs vorbefüllt',
      'Speichern ruft PATCH /api/expenses/{id} auf',
      'Nur Entwürfe sind bearbeitbar']),
    (58, 2, 'Story', 'Spesenliste nach Status filtern', 3, ['fullstack', 'refined', 'sprint-8'],
     'Als Mitarbeiter:in möchte ich meine Ausgaben nach Status filtern, damit ich offene Einreichungen schnell finde.',
     ['Status-Chips oberhalb der Liste, Mehrfachauswahl möglich',
      'API: GET /api/expenses unterstützt Filter nach einem oder mehreren Status',
      'Anzahl und Paginierung beziehen sich auf die gefilterte Menge',
      'Kein Treffer: verständlicher leerer Zustand',
      'Filter bleibt nach einem Reload erhalten (URL-Query-Parameter)']),
    (59, 1, 'Story', 'Validierung im Erfassungsformular', 2, ['frontend', 'refined'],
     'Als Mitarbeiter:in möchte ich sofort sehen, was an meiner Eingabe falsch ist.',
     ['Betrag muss größer als 0 sein, maximal zwei Nachkommastellen',
      'Datum darf nicht in der Zukunft liegen',
      'Fehlermeldung direkt am jeweiligen Feld statt einer Sammelmeldung']),
    (60, 3, 'Story', 'API: Ausgabe mit Begründung ablehnen', 3, ['backend', 'team-be', 'refined', 'sprint-8'],
     'Als Kostenstellenverantwortliche:r möchte ich eine Einreichung mit Begründung ablehnen können.',
     ['POST /api/approvals/{id}/reject mit Body { reason }',
      'reason ist Pflicht, 5 bis 300 Zeichen',
      'Nur Status SUBMITTED kann abgelehnt werden',
      'Swagger-Doku ist aktualisiert']),
    (61, 2, 'Bug', 'Spesenliste: Sortierung nach Datum ist falsch', 1, ['frontend', 'refined', 'sprint-8'],
     'Nach Klick auf den Spaltenkopf „Datum“ stehen Ausgaben aus verschiedenen Monaten in falscher Reihenfolge (z. B. 02.09. vor 04.07. vor 07.06.).',
     ['Reproduktion: als Anna Becker anmelden, auf „Datum“ klicken',
      'Erwartet: chronologisch auf- bzw. absteigend',
      'Ein Test sichert das Verhalten ab']),
    (62, 3, 'Story', 'Ausgabe im UI ablehnen', 3, ['frontend', 'refined'],
     'Als Kostenstellenverantwortliche:r möchte ich in der Genehmigungsübersicht ablehnen und eine Begründung angeben.',
     ['Abhängig von EXP-60 und EXP-55',
      'Begründung über Vorschlagsliste oder Freitext',
      'Mitarbeiter:in sieht den Grund in der Detailansicht']),
    (63, 2, 'Story', 'Spesenliste: Lade- und Leerzustand', 1, ['frontend', 'refined', 'sprint-8'],
     'Als Mitarbeiter:in möchte ich erkennen, ob die Liste noch lädt oder wirklich leer ist.',
     ['Während des Ladens ist ein Ladezustand sichtbar',
      'Ohne Ausgaben: Hinweis mit Link „Ausgabe erfassen“']),
    (64, 4, 'Story', 'Dashboard: Ausgaben pro Kategorie im aktuellen Monat', 5, ['frontend', 'refined'],
     'Als Mitarbeiter:in möchte ich sehen, wofür ich in diesem Monat wie viel ausgegeben habe.',
     ['Neue Seite „Übersicht“ mit Summe je Kategorie in EUR, absteigend sortiert',
      'Gesamtsumme des Monats',
      'Monat umschaltbar (vorheriger/nächster)',
      'Offene Frage: Aggregation im Client oder neuer Endpunkt (siehe EXP-77)?']),
    (65, 5, 'Story', 'Kostenstellen als Baum anzeigen', 5, ['frontend', 'refined'],
     'Als Mitarbeiter:in der Buchhaltung möchte ich die Kostenstellenhierarchie als Baum sehen.',
     ['Datenquelle: GET /api/cost-centers (flach, mit parentId)',
      'Baum beliebig tief, Knoten auf- und zuklappbar',
      'Verantwortliche Person je Knoten sichtbar']),
    (66, 2, 'Bug', 'API: total in der Paginierung zählt alle Ausgaben', 2, ['backend', 'refined', 'sprint-8'],
     'GET /api/expenses liefert als total die Anzahl aller Ausgaben im System statt der eigenen. Anna sieht „152 Ausgaben insgesamt“ und 8 Seiten, ab Seite 3 sind die Seiten leer.',
     ['total entspricht der Anzahl der Treffer nach allen Filtern',
      'Unit-Test deckt den Fall ab']),
    (67, 7, 'Story', 'API: PATCH /expenses mit DTO und Validierung', 2, ['backend', 'team-be', 'refined', 'sprint-8'],
     'Der PATCH-Endpunkt nimmt aktuell beliebige Felder an. Er soll wie POST validieren.',
     ['UpdateExpenseDto mit denselben Regeln wie CreateExpenseDto, alle Felder optional',
      'Unbekannte Felder werden verworfen',
      'Tests für gültige und ungültige Änderungen']),
    (68, 6, 'Story', 'Beleg hochladen per Drag & Drop', 8, ['fullstack'],
     'Als Mitarbeiter:in möchte ich zu einer Ausgabe einen Beleg (PDF, JPG, PNG, max. 5 MB) hochladen. Zu groß für einen Sprint, bitte im Refinement schneiden.', []),
    (69, 4, 'Story', 'CSV-Export für die Buchhaltung', None, ['fullstack'],
     'Als Buchhaltung möchte ich genehmigte Ausgaben eines Monats als CSV exportieren.', []),
    (70, 4, 'Story', 'Monatsvergleich als Balkendiagramm (ohne Chart-Bibliothek)', None, ['frontend'],
     'Als Mitarbeiter:in möchte ich meine Ausgaben der letzten sechs Monate vergleichen.', []),
    (71, 7, 'Story', 'Einheitliche Fehlerbehandlung im Frontend', 3, ['frontend', 'refined'],
     'HTTP-Fehler verschwinden aktuell stillschweigend. Nutzer:innen sollen verständliche Hinweise bekommen.',
     ['Zentrale Behandlung von HTTP-Fehlern (401, 403, 404, 400, 5xx)',
      'Validierungsfehler der API werden am Formular angezeigt',
      'Kein Button bleibt nach einem Fehler dauerhaft deaktiviert']),
    (72, 5, 'Story', 'Kostenstellen-Summen inklusive Unterkostenstellen', 5, ['fullstack'],
     'Als Kostenstellenverantwortliche:r möchte ich die Summe meiner Kostenstelle inklusive aller Unterkostenstellen sehen.', []),
    (73, 7, 'Story', 'Persistenz: Datenbank statt In-Memory', 8, ['backend'],
     'Änderungen gehen beim Neustart verloren (ADR-0003). Welche Datenbank, welches Mapping, welche Migrationen? ADR erforderlich.', []),
    (74, 2, 'Story', 'Filter- und Sortierzustand in der URL (Deep Links)', 3, ['frontend'],
     'Als Mitarbeiter:in möchte ich einen Link auf meine gefilterte Liste speichern können.', []),
    (75, 7, 'Task', 'Spike: SSO-Anbindung (Entra ID)', None, ['fullstack'],
     'Ablösung der Demo-Authentifizierung (ADR-0004) vorbereiten.', []),
    (76, 1, 'Story', 'Ausgaben zu einer Reise gruppieren', 8, ['fullstack'],
     'Als Mitarbeiter:in möchte ich mehrere Ausgaben einer Dienstreise zusammenfassen und gemeinsam einreichen.', []),
    (77, 4, 'Story', 'API: Aggregations-Endpunkt nach Kategorie', 3, ['backend'],
     'Alternative zu clientseitiger Aggregation für EXP-64. Im Refinement abwägen.', []),
    (78, 1, 'Bug', 'Detailansicht zeigt Datum im ISO-Format', 1, ['frontend', 'refined'],
     'Die Liste zeigt 02.09.2026, die Detailansicht 2026-09-02. Einheitlich deutsches Format.',
     ['Datum überall im Format TT.MM.JJJJ', 'Eine zentrale Lösung statt Formatierung pro Komponente']),
    (79, 3, 'Story', 'Hinweis bei Genehmigung oder Ablehnung', None, ['frontend'],
     'Als Mitarbeiter:in möchte ich sehen, welche meiner Einreichungen sich seit meinem letzten Besuch geändert haben.', []),
    (80, 7, 'Story', 'Barrierefreiheit von Tabelle und Formular', 3, ['frontend'],
     'Tastaturbedienung, Fokusreihenfolge, Labels und Screenreader-Texte prüfen und verbessern.', []),
]

def row(issue_id, typ, summary, desc, parent, sp, labels, status):
    return {'Issue ID': issue_id, 'Issue Type': typ, 'Summary': summary, 'Description': desc,
            'Parent': parent or '', 'Story Points': sp if sp is not None else '',
            'Labels': ' '.join(labels), 'Status': status}

rows = []
for i, (name, desc) in enumerate(EPICS, start=1):
    rows.append(row(i, 'Epic', name, desc, None, None, [], 'To Do'))
key = len(EPICS)
for sprint, epic, typ, summary, sp in HISTORY:
    key += 1
    rows.append(row(key, typ, summary, f'Abgeschlossen in Sprint {sprint}.', epic, sp, [f'sprint-{sprint}'], 'Done'))
assert key == 52, key
for k, epic, typ, summary, sp, labels, story, ac in OPEN:
    key += 1
    assert key == k, (key, k)
    desc = story
    if ac:
        desc += '\n\nAkzeptanzkriterien:\n' + '\n'.join(f'- {a}' for a in ac)
    rows.append(row(key, typ, summary, desc, epic, sp, labels, 'To Do'))

with open(OUT / 'jira-import.csv', 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)

# backlog.md
lines = ['# Produkt-Backlog Spesenportal', '',
         'Quelle der Wahrheit ist Jira. Diese Datei ist der Import-Stand vom Start von Sprint 8.',
         'Labels: `frontend`, `backend`, `fullstack` = für Joon möglich · `team-be` = BE-Team (Katrin, Tim) · `refined` = bereit für Planning', '',
         '## Epics', '']
for i, (name, desc) in enumerate(EPICS, start=1):
    lines.append(f'- **EXP-{i} {name}**: {desc}')
lines += ['', '## Offene Einträge', '']
for k, epic, typ, summary, sp, labels, story, ac in OPEN:
    sp_txt = f'{sp} SP' if sp is not None else 'nicht geschätzt'
    lines.append(f'### EXP-{k} · {summary}')
    lines.append(f'{typ} · Epic EXP-{epic} · {sp_txt} · {", ".join(labels)}')
    lines.append('')
    lines.append(story)
    if ac:
        lines.append('')
        lines.append('Akzeptanzkriterien:')
        lines += [f'- {a}' for a in ac]
    lines.append('')
(OUT / 'backlog.md').write_text('\n'.join(lines), encoding='utf-8')

# sprint-history.md
hist = ['# Sprint-Historie (Sprint 1–7)', '', '| Sprint | Zeitraum | Erledigt (SP) | Einträge |', '|---|---|---|---|']
import datetime
start = datetime.date(2026, 6, 22)
for s in range(1, 8):
    items = [(i + 8, h) for i, h in enumerate(HISTORY) if h[0] == s]
    sp = sum(h[4] for _, h in items)
    a = start + datetime.timedelta(days=14 * (s - 1)); b = a + datetime.timedelta(days=13)
    keys = ', '.join(f'EXP-{k}' for k, _ in items)
    hist.append(f'| {s} | {a:%d.%m.}–{b:%d.%m.%Y} | {sp} | {keys} |')
hist += ['', 'Hinweis: Die Sprints 1–7 liefen vor Joons Einstieg. Das Team hatte in dieser Zeit eine:n Junior-Entwickler:in, deren/dessen Stelle Joon als Fullstack-Entwickler übernimmt.']
(OUT / 'sprint-history.md').write_text('\n'.join(hist) + '\n', encoding='utf-8')
print(f'{len(rows)} Zeilen (EXP-1 bis EXP-{key}) geschrieben')

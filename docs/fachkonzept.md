# Fachkonzept Spesenportal

- Verantwortlich: Lena Vogel
- Review: Thomas Brandt, Markus Weber, Sabine Keller
- Status: Entwurf
- Stand: 26.09.2026

## 1. Vision und Ziele

Das Spesenportal ersetzt bei der Nordwerk AG die bisherige Excel-Vorlage für Reisekosten und sonstige Spesen. Mitarbeitende erfassen ihre Ausgaben digital, Kostenstellenverantwortliche prüfen und entscheiden, die Buchhaltung veranlasst die Auszahlung.

Ziele:

- Ausgaben werden schneller erfasst, geprüft und ausgezahlt als mit der Excel-Vorlage.
- Die Spesenrichtlinie wird für alle Mitarbeitenden gleich angewendet.
- Jede Entscheidung (Genehmigung, Ablehnung) ist nachvollziehbar dokumentiert.
- Mitarbeitende behalten jederzeit den Überblick über den Status ihrer Einreichungen.

Nicht Ziel dieses Dokuments: technische Umsetzung. Das Fachkonzept beschreibt, welche Regeln gelten – nicht, wie sie im Code umgesetzt werden.

## 2. Nutzer:innen und Rollen

| Rolle | Bezeichnung | Aufgabe |
|---|---|---|
| EMPLOYEE | Mitarbeiter:in | Ausgaben erfassen, einreichen, eigene Ausgaben einsehen |
| APPROVER | Kostenstellenverantwortliche:r | Einreichungen der eigenen Kostenstelle(n) prüfen, genehmigen oder ablehnen |
| ACCOUNTING | Buchhaltung | Genehmigte Ausgaben auszahlen, Auswertungen für die Buchführung |

Jede Person hat genau eine Rolle. Jede Kostenstelle hat höchstens eine verantwortliche Person (Ausnahme: „1000 Geschäftsführung“ hat aktuell keine Verantwortliche:n hinterlegt, siehe offene Frage 1).

Das Genehmigungsrecht hängt an der Zuordnung „Verantwortliche:r einer Kostenstelle“, nicht an der Rolle. Auch eine Person mit der Rolle ACCOUNTING kann für bestimmte Kostenstellen genehmigungsberechtigt sein. Eine detaillierte Berechtigungsmatrix (wer sieht, bearbeitet, entscheidet, zahlt aus) steht in Kapitel 6.

## 3. Geschäftsprozess und Statusübergänge

Eine Ausgabe durchläuft folgenden Grundprozess: Erfassen als Entwurf, Einreichen, Entscheidung durch die zuständige Kostenstellenverantwortliche:r, bei Genehmigung Auszahlung durch die Buchhaltung.

| Von | Nach | Auslöser | Wer | Bedingung |
|---|---|---|---|---|
| – | DRAFT | Ausgabe erfassen | Ersteller:in der Ausgabe | Kostenstelle ist eine Blatt-Kostenstelle (Auswahl siehe 4.6) |
| – | SUBMITTED | Erfassen und direkt einreichen | Ersteller:in der Ausgabe | Pflichtfelder vollständig und gültig (EXP-26) |
| DRAFT | DRAFT | Entwurf bearbeiten | Ersteller:in der Ausgabe | nur im Status DRAFT möglich |
| DRAFT | SUBMITTED | Einreichen | Ersteller:in der Ausgabe | Pflichtfelder vollständig und gültig |
| DRAFT | – | Entwurf löschen | Ersteller:in der Ausgabe | nur im Status DRAFT möglich |
| SUBMITTED | APPROVED | Genehmigen | Kostenstellenverantwortliche:r der betroffenen Kostenstelle | siehe offene Frage 1 |
| SUBMITTED | REJECTED | Ablehnen | Kostenstellenverantwortliche:r der betroffenen Kostenstelle | Begründung Pflicht, 5–300 Zeichen |
| APPROVED | PAID | Auszahlung verbuchen | Buchhaltung | siehe offene Frage 5 |

„Ersteller:in der Ausgabe“ ist bewusst nicht mit der Rolle EMPLOYEE gleichgesetzt: Auch Kostenstellenverantwortliche und Buchhaltung erfassen eigene Ausgaben.

Ziel ist ein lückenloses Protokoll: Jeder Statuswechsel – einschließlich Einreichen und Auszahlung – wird mit Zeitpunkt, handelnder Person, altem und neuem Status protokolliert; bei Ablehnung zusätzlich mit Begründung. Protokolleinträge sind nicht änderbar. Aktuell dienen dazu die Felder `submittedAt`, `decidedAt`, `decidedBy` und `rejectionReason`; ein vollständiges, dauerhaftes Protokoll benötigt Persistenz (Kapitel 6, EXP-73). Das Feld `receiptFileName` ist vorgesehen, aber erst mit dem Belegupload (EXP-68) nutzbar.

In der Detailansicht einer abgelehnten Ausgabe werden Ablehnungsgrund, entscheidende Person und Entscheidungszeitpunkt angezeigt; die Liste zeigt dafür nur den Status. Die Detailansicht zeigt außerdem die Ausgaben-ID, damit sie sich während der Übergangsphase (4.2) einem separat eingereichten Papierbeleg zuordnen lässt. In der Genehmigungsübersicht (EXP-55) bezieht sich die Spalte „Datum“ auf den Einreichungszeitpunkt, da davon die Zielwerte aus 4.3 abhängen; das Ausgabendatum wird zusätzlich als eigene Spalte angezeigt.

REJECTED ist im aktuellen Modell ein Endzustand. Ob eine abgelehnte Ausgabe erneut eingereicht werden kann, ist offene Frage 4.

## 4. Spesenrichtlinie

### 4.1 Kategorien und Höchstbeträge

Es gibt zwölf Kategorien. Wo sinnvoll, gilt ein Richtwert statt eines starren Höchstbetrags, weil eine Ausgabe (z. B. ein Hotelaufenthalt über mehrere Nächte) als ein Betrag erfasst wird.

| Kategorie (Key) | Bezeichnung | Regel |
|---|---|---|
| HOTEL | Übernachtung | Angemessenes Mittelklassehotel. Richtwert: bis 130 €/Nacht im Inland, bis 180 €/Nacht im Ausland bzw. in teuren Ballungsräumen. Mehrere Nächte werden als eine Ausgabe erfasst. |
| TRAIN | Bahnfahrt | 2. Klasse. 1. Klasse nur mit nachvollziehbarem Grund. |
| FLIGHT | Flug | Economy-Klasse, jeweils günstigste verfügbare Tarifoption. Zusatzleistungen wie Sitzplatzreservierung, Gepäck-Upgrade oder Lounge-Zugang sind nur bei dienstlicher Notwendigkeit erstattungsfähig. |
| TAXI | Taxi | Nur wenn öffentliche Verkehrsmittel nicht zumutbar oder der Termin zeitkritisch ist. |
| RENTAL_CAR | Mietwagen | Mittelklassefahrzeug. Vollkaskoversicherung mit Selbstbeteiligung 0 € ist Teil der Ausgabe. |
| FUEL | Kraftstoff | Nur in Verbindung mit einem genehmigten Mietwagen oder Dienstfahrzeug. |
| PARKING | Parken | Nachweis erforderlich, siehe Ausnahme in 4.2. |
| HOSPITALITY | Bewirtung | Nur bei geschäftlichem Anlass. Dokumentation siehe 4.2. Richtwert: bis 60 €/Person. |
| PER_DIEM | Verpflegungsmehraufwand | Pauschale je Kalendertag mit auswärtiger Tätigkeit: bis zu 14 € für den An- und Abreisetag einer mehrtägigen Reise sowie für eine eintägige Abwesenheit von mehr als 8 Stunden; bis zu 28 € für volle Kalendertage mit einer Abwesenheit von 24 Stunden. Gestellte Mahlzeiten werden pauschal abgezogen. Auslandssätze: auf Anfrage bei der Buchhaltung. |
| OFFICE | Büromaterial | Verbrauchsmaterial für den Bürobedarf. |
| SOFTWARE | Software & Abos | Erfassung der Kosten; die eigentliche Freigabe von Lizenzen läuft über die IT. |
| OTHER | Sonstiges | Beschreibung muss den Anlass erkennbar machen. |

Die zwölf Kategorien sind abschließend, siehe Nicht-Ziele in Kapitel 5.

### 4.2 Belegpflicht

Grundsatz: Für jede Ausgabe ist ein Beleg erforderlich, mit Ausnahme des Verpflegungsmehraufwands (Pauschale ohne Einzelbeleg).

Ausnahme Eigenbeleg: Wenn kein Beleg ausgestellt werden kann (z. B. Parkscheinautomat), genügt bis 10 € ein selbst erstellter Eigenbeleg mit Datum, Betrag und Anlass.

Bewirtung: Anlass und teilnehmende Personen werden auf dem Bewirtungsbeleg (Papier) vermerkt. In der digitalen Beschreibung genügt eine kurze Angabe des Anlasses (z. B. „Kundentermin – Bewirtung“); die Teilnehmerliste muss dort nicht wiederholt werden.

Solange kein Beleg-Upload existiert (bis EXP-68), prüft die entscheidende Person die Belegpflicht anhand des separat eingereichten Originalbelegs. Der Originalbeleg wird in Papierform oder per E-Mail an die Buchhaltung übermittelt, unter Angabe der Ausgaben-ID. Nach EXP-68 ist der Beleg beim Einreichen verpflichtend hochzuladen, außer bei PER_DIEM und bei als Eigenbeleg markierten Ausgaben ≤ 10 €.

### 4.3 Einreichfrist

Ausgaben sollen zeitnah erfasst und eingereicht werden. Zielwert: Einreichung innerhalb von 14 Kalendertagen nach dem Ausgabendatum, Entscheidung innerhalb von 10 Kalendertagen nach Einreichung.

Spätester Termin: Ausgaben sind spätestens 3 Monate nach dem Ausgabendatum einzureichen. Ausgaben des abgelaufenen Geschäftsjahres sind spätestens bis zum 15. Januar des Folgejahres einzureichen.

### 4.4 Genehmigung

Entscheidungsbefugt ist die Kostenstellenverantwortliche:r der Kostenstelle, auf die die Ausgabe gebucht ist – unabhängig davon, ob diese Person die Rolle APPROVER oder ACCOUNTING trägt (Kapitel 2, Berechtigungsmatrix in Kapitel 6).

Grundsatz ist das Vier-Augen-Prinzip: Einreichende und Entscheidende sind nicht dieselbe Person. Für Kostenstellenverantwortliche und Buchhaltung, die ihre eigenen Ausgaben einreichen, ist das noch nicht abschließend geregelt, siehe offene Frage 1.

Bei Ablehnung ist eine Begründung Pflicht: ein Freitext von 5–300 Zeichen (ohne führende und folgende Leerzeichen), passend zu EXP-60. Zur Auswahl stehen vorformulierte Texte, die vor dem Speichern angepasst werden können:

- Beleg fehlt
- Betrag übersteigt Richtlinie
- Falsche Kostenstelle
- Freitext (eigene Formulierung)

Gespeichert wird ausschließlich der resultierende Text – die 5–300 Zeichen beziehen sich auf diesen gespeicherten Text, unabhängig davon, ob er aus einer Vorlage stammt oder frei eingegeben wurde. Eine Auswertung nach Ablehnungsgrund-Kategorie ist damit aktuell nicht möglich; falls das gebraucht wird, ist das ein späterer Ausbau und kein Bestandteil von EXP-60.

### 4.5 Wechselkurse

Unterstützte Währungen: EUR, CHF, USD. Kurse sind als „1 Einheit Fremdwährung = x Euro“ definiert:

| Währung | Kurs |
|---|---|
| EUR | 1 EUR = 1,00 EUR |
| CHF | 1 CHF = 1,07 EUR |
| USD | 1 USD = 0,92 EUR |

Maßgeblich ist der Kurs zum Zeitpunkt des Einreichens, nicht der Kurs am Ausgabendatum: Das vermeidet eine historische Kurstabelle und ist für Mitarbeitende leichter nachvollziehbar, auch wenn er vom tatsächlichen Kartenkurs am Ausgabetag abweichen kann. Der angewendete Kurs wird zusammen mit der Ausgabe gespeichert. Die Umrechnung in Euro erfolgt kaufmännisch gerundet auf zwei Nachkommastellen.

Die Kurse selbst sind aktuell fest hinterlegt und werden nicht automatisch aktualisiert; Pflege und Rhythmus sind offene Frage 3.

### 4.6 Pflichtfelder und Validierung

Gilt gleichermaßen für Erfassen und Bearbeiten eines Entwurfs:

| Feld | Regel |
|---|---|
| Datum | Pflicht, Kalenderdatum ohne Uhrzeit, nicht in der Zukunft |
| Kategorie | Pflicht, eine der zwölf Kategorien aus 4.1 |
| Betrag | Pflicht, größer als 0, maximal zwei Nachkommastellen |
| Währung | Pflicht, EUR, CHF oder USD |
| Kostenstelle | Pflicht, jede Blatt-Kostenstelle wählbar, Vorauswahl die eigene Kostenstelle |
| Beschreibung | Pflicht, maximal 200 Zeichen |

Jede Blatt-Kostenstelle ist wählbar (nicht nur die eigene), damit sich Ausgaben abbilden lassen, die für eine andere Kostenstelle anfallen (z. B. eine gemeinsame Dienstreise). Sichtbar ist dabei nur die Kostenstellenstruktur (Nummer, Name, Verantwortliche:r), keine fremden Ausgaben; das eigentliche Sichtbarkeitsrecht für Ausgaben regelt die Berechtigungsmatrix in Kapitel 6.

## 5. Umfang und Roadmap

Einordnung nach Epics:

- **EXP-1 Spesen erfassen**: Erfassen, als Entwurf speichern und Einreichen sind fertig. Als Nächstes: Entwurf bearbeiten (EXP-57), bessere Validierung im Formular (EXP-59), einheitliches Datumsformat (EXP-78). Später denkbar: mehrere Ausgaben zu einer Dienstreise gruppieren (EXP-76).
- **EXP-2 Übersicht & Suche**: Liste ist vorhanden. Sprint 8 (28.09.–11.10.): Sortierbug beheben (EXP-61), Filter nach Status (EXP-58), korrekte Trefferzahl in der Paginierung (EXP-66), Lade- und Leerzustand (EXP-63). Danach: Freitextsuche (EXP-53), Filter nach Kategorie (EXP-54), Filterzustand als Deep Link (EXP-74).
- **EXP-3 Genehmigungsworkflow**: Genehmigen existiert bisher nur als API. Sprint 8: Ablehnen mit Begründung als API (EXP-60). Danach: Genehmigungsübersicht im UI (EXP-55), Genehmigen im UI (EXP-56), Ablehnen im UI (EXP-62), Hinweis bei geänderten Einreichungen (EXP-79).
- **EXP-4 Auswertung & Dashboard**: Noch nicht begonnen. Geplant: Ausgaben pro Kategorie im Monat (EXP-64), dazu ein Aggregations-Endpunkt (EXP-77), CSV-Export für die Buchhaltung (EXP-69), Monatsvergleich (EXP-70).
- **EXP-5 Kostenstellen**: Noch nicht begonnen. Geplant: Kostenstellen als Baum (EXP-65), Summen inklusive Unterkostenstellen (EXP-72).
- **EXP-6 Belege**: Noch nicht begonnen. Geplant: Beleg-Upload per Drag & Drop (EXP-68) – zu groß für einen Sprint, muss im Refinement geschnitten werden.
- **EXP-7 Plattform & Qualität**: Sprint 8: Validierung im PATCH-Endpunkt (EXP-67). Danach: einheitliche Fehlerbehandlung im Frontend (EXP-71), Persistenz statt In-Memory (EXP-73), Spike zu SSO (EXP-75), Barrierefreiheit (EXP-80).

Sprint-8-Ziel: „Meine Ausgaben“ zeigt für Mitarbeiter:innen korrekte, filterbare Ergebnisse.

Nicht-Ziele (bewusst nicht Teil des aktuellen Umfangs):

- Kilometerpauschale für private PKW-Nutzung.
- Weitere Währungen außer EUR, CHF, USD.
- Automatisierte Prüfung von Nacht-, Personen- oder Tagesgrenzen im System (siehe offene Frage 2).
- Eine native Mobile-App; vorgesehen ist eine responsive Web-Oberfläche (EXP-42).
- Reisebuchung oder Reiseantrag (das Portal erfasst nur bereits entstandene Ausgaben).
- Der Zahlungsverkehr selbst; das Portal setzt nur den Status „ausgezahlt“, führt aber keine Zahlung aus.
- Mehrstufige Genehmigungsketten; genau eine Kostenstellenverantwortliche:r entscheidet je Ausgabe.
- Ein automatischer Abgleich mit Kreditkartenabrechnungen.

## 6. Nicht-funktionale Anforderungen

**DSGVO und Berechtigungen**

| Aktion | Ersteller:in der Ausgabe | Verantwortliche:r der gebuchten Kostenstelle | Buchhaltung |
|---|---|---|---|
| Ausgabe sehen | ja, eigene | ja, für die eigene Kostenstelle | ja, alle (für Auszahlung) |
| Ausgabe anlegen/bearbeiten (nur DRAFT) | ja | nein | nein |
| Einreichen | ja | nein | nein |
| Genehmigen/Ablehnen | nein (Grundsatz; Ausnahmen bei Verantwortlichen siehe offene Frage 1) | ja, für die eigene Kostenstelle | nein, außer als Verantwortliche:r einer Kostenstelle (Kapitel 2) |
| Als ausgezahlt markieren | nein | nein | ja |

Berechtigungen werden serverseitig anhand der angemeldeten Identität und der Kostenstellen-Zuordnung geprüft; die Sichtbarkeit eines Menüpunkts im UI ist kein Berechtigungsmerkmal. Aufbewahrungs- und Löschfristen sind mit Buchhaltung und Datenschutz festzulegen. Für ausgeschiedene Mitarbeitende bleiben deren Ausgaben und Entscheidungen für die Aufbewahrungsfrist sichtbar, jedoch ohne aktiven Kontozugriff.

**Nachvollziehbarkeit / Audit**: siehe Statusprotokoll in Kapitel 3. Solange Daten nur im Arbeitsspeicher liegen (ADR-0003), ist ein dauerhaftes Protokoll nicht erreichbar; Voraussetzung ist EXP-73.

**Barrierefreiheit**: Alle Seiten erfüllen WCAG 2.2, Stufe AA. Nachweis je Story: automatisierte Prüfung ohne Befunde der Stufen A/AA und ein manueller Tastaturtest; vor einem Release zusätzlich ein Screenreader-Test. WCAG 2.2 statt 2.1, weil EXP-68 (Drag & Drop) eine Alternative zum Ziehen braucht (Kriterium 2.5.7) und Schaltflächen in Tabellenzeilen eine Mindestgröße einhalten müssen (Kriterium 2.5.8). Bezug: EXP-80.

**Unterstützte Browser**: jeweils die zwei aktuellsten Hauptversionen von Chrome, Edge, Firefox (zusätzlich die aktuelle ESR-Version) und Safari (macOS und iOS) sowie Chrome auf Android, soweit von der eingesetzten Angular-Version unterstützt; maßgeblich ist der Stand zum Release-Termin. Der tatsächliche Bestand an IT-verwalteten Browsern im Unternehmen ist mit der IT abzugleichen.

**Sprache und Formate**: Oberfläche auf Deutsch. Ausgabedatum ist ein Kalenderdatum ohne Uhrzeit, Anzeige TT.MM.JJJJ. Zeitpunkte (Einreichung, Entscheidung) werden mit Datum und Uhrzeit in der Zeitzone Europe/Berlin angezeigt, Format TT.MM.JJJJ, HH:MM. Beträge werden mit Komma als Dezimaltrennzeichen ein- und ausgegeben; eine Ausgabe in Fremdwährung zeigt zusätzlich den Euro-Betrag (z. B. „120,00 CHF (128,40 €)“), auch in der Genehmigungsübersicht (EXP-55). Summen und Auswertungen ausschließlich in EUR. Statusbezeichnungen: Entwurf, Eingereicht, Genehmigt, Abgelehnt, Ausgezahlt. Bezug: EXP-78, EXP-35.

**Mobile Nutzung**: ab 320 CSS-Pixel Breite ohne Verlust von Inhalt oder Funktion; Tabellen dürfen horizontal scrollen. Erfassen, Einreichen und Einsehen eigener Ausgaben sind auf Smartphones vollständig nutzbar. Genehmigen und Ablehnen sollen ebenfalls auf Smartphones möglich sein, damit die Zielwerte aus 4.3 auch unterwegs eingehalten werden können. Bezug: EXP-42.

**Sicherheit**: Die aktuelle Demo-Authentifizierung (`X-Demo-User`, ADR-0004) ist nur für die Entwicklung gedacht. Vor einem Produktivbetrieb ist eine echte Anmeldung (SSO, EXP-75) erforderlich.

## 7. Glossar

| Deutsch | Koreanisch |
|---|---|
| Spesen / Ausgabe | 경비 / 지출 건 |
| Kostenstelle | 비용센터 |
| Blatt-Kostenstelle | 말단 비용센터 |
| Kostenstellenverantwortliche:r | 비용센터 책임자 |
| Mitarbeiter:in | 직원 |
| Buchhaltung | 회계팀 |
| Entwurf | 임시 저장(초안) |
| Einreichen | 제출 |
| Genehmigen | 승인 |
| Ablehnen | 반려 |
| Ablehnungsgrund | 반려 사유 |
| Beleg | 영수증 / 증빙 |
| Eigenbeleg | 자체 작성 증빙 |
| Bewirtung | 접대(식사 등 대외 접대) |
| Verpflegungsmehraufwand | 출장 식비 정액 수당 |
| Dienstreise | 출장 |
| Vier-Augen-Prinzip | 상호 검증 원칙(신청자와 결재자 분리) |
| Richtwert | 권장 기준액 |
| Auszahlung | 지급 |
| Wechselkurs | 환율 |
| Spesenrichtlinie | 경비 규정 |

## 8. Offene Fragen

1. **Genehmigung bei Kostenstellenverantwortlichen und Buchhaltung in eigener Sache**: In den Beispieldaten entscheiden Kostenstellenverantwortliche in 15 Fällen selbst über ihre eigenen Ausgaben – teils gebucht auf eine nicht blattständige Kostenstelle (z. B. 1100, 1200), teils auf eine Blatt-Kostenstelle, für die sie selbst zuständig sind (z. B. 1310). Zusätzlich hat „1000 Geschäftsführung“ aktuell keine, und „1300 Verwaltung“ dieselbe Verantwortliche wie ihre Unterkostenstellen, sodass eine Eskalation „eine Ebene höher“ nicht zwangsläufig zu einer anderen Person führt. „Der Einreichende entscheidet nicht über die eigene Ausgabe“ kann daher nicht als feste Regel gelten. Zwei Optionen zur Diskussion: (A) Es entscheidet die erste Verantwortliche:r entlang der Kostenstellen-Hierarchie, die nicht die einreichende Person ist – dafür müsste für „1000 Geschäftsführung“ eine Verantwortliche:r benannt werden. (B) Jede Kostenstelle bekommt zusätzlich eine Stellvertretung, die bei Eigenbetroffenheit entscheidet. Davon hängt auch ab, ob der Menüpunkt „Zu genehmigen“ wie in EXP-55 beschrieben an die Rolle APPROVER gebunden bleiben kann, oder ob er sich nach der Kostenstellen-Zuordnung richten muss. Bezug: EXP-55, EXP-41.
2. **Automatisierte Prüfung von Höchstbeträgen**: Die Richtwerte in 4.1 beziehen sich auf Nacht, Person oder Tag. Das Erfassungsformular hat aktuell keine Felder für Nächte, Personenzahl oder Reisetage. Soll das System Grenzen künftig aktiv prüfen (Warnung oder Blockade), und welche zusätzlichen Felder wären dafür nötig? Bezug: EXP-59, EXP-76.
3. **Pflege der Wechselkurse**: Wer aktualisiert die in 4.5 hinterlegten Kurse und in welchem Rhythmus? Wie gehen wir mit der Abweichung zum tatsächlichen Kartenkurs der Mitarbeitenden um?
4. **Erneutes Einreichen nach Ablehnung**: Aktuell ist REJECTED ein Endzustand. Soll eine abgelehnte Ausgabe korrigiert und erneut eingereicht werden können (z. B. REJECTED → DRAFT), oder muss eine neue Ausgabe angelegt werden? Falls Wiedereinreichen erlaubt wird, darf die vorherige Ablehnung (Grund, Zeitpunkt, entscheidende Person) im Protokoll nicht überschrieben werden, sondern muss als Verlauf erhalten bleiben (Kapitel 3). Bezug: EXP-62.
5. **Setzen des Status PAID**: Wer markiert eine genehmigte Ausgabe als ausgezahlt, und geschieht das manuell oder im Zusammenhang mit dem CSV-Export für die Buchhaltung? Bezug: EXP-69.

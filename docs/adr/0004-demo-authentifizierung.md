# ADR-0004: Demo-Authentifizierung per Header bis zur SSO-Anbindung

- Status: akzeptiert, befristet (Sprint 1)
- Beteiligte: Markus Weber, Thomas Brandt

## Kontext
Die SSO-Anbindung hängt an der IT-Sicherheit und dauert noch. Das Team will trotzdem rollenabhängige Funktionen bauen.

## Entscheidung
- Das Frontend schickt die ID des gewählten Demo-Nutzers im Header `X-Demo-User`.
- Ein globaler Guard lädt den Nutzer, Endpunkte mit `@Public()` sind ausgenommen.
- Der Login-Screen listet alle Demo-Nutzer nach Rolle.

## Konsequenzen
- Keine echte Sicherheit. Nur für Entwicklung und Demo.
- Berechtigungsprüfungen im Backend bleiben trotzdem nötig und werden so geschrieben, als wäre die Identität echt.
- Ablösung: Spike EXP-75.

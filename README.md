# Spesenportal · Nordwerk AG

Reisekosten und Spesen erfassen, einreichen, genehmigen. Angular 22 + NestJS 12.

## Schnellstart

```bash
nvm install      # Node 24 laut .nvmrc
npm install      # installiert auch backend/ und frontend/
npm run dev      # API :3000, Web :4200
```

- Web: http://localhost:4200 (Demo-Login, z. B. Anna Becker)
- API-Doku: http://localhost:3000/api/docs
- Tests: `npm test`

## Struktur

| Pfad | Inhalt |
|---|---|
| `frontend/` | Angular-App (Standalone, Signals, Zoneless) |
| `backend/` | NestJS-API mit In-Memory-Daten aus `backend/data/` |
| `docs/` | Onboarding, Architektur, Konventionen, ADRs |
| `backlog/` | Jira-Import und Sprint-Planung |
| `scripts/` | Seed- und Backlog-Generator, Slack-Skript |
| `routines/` | Prompts für die geplanten Team-Routinen |
| `.claude/` | Team-Agenten, Befehle, Team-Notizen |
| `.github/` | Automatische Reviews, PR-Vorlage |

## Für Joon

Dieses Repository ist ein simuliertes Scrum-Team: Außer dir werden alle Rollen von Claude übernommen.

1. `docs/setup/day-0-checklist.md` – Einrichtung (Teil A jetzt, Teil B am Samstag)
2. `docs/team.md` – wer wer ist, wann was passiert, wie du das Team ansprichst
3. `docs/onboarding.md` – dein erster Tag im Projekt

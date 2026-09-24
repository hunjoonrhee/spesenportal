# Architektur

```
Browser (Angular 22, :4200)  ──/api (Proxy)──►  NestJS 12 (:3000)  ──►  In-Memory-Store ◄── backend/data/*.json
```

## Frontend (`frontend/`)

```
src/app/
├─ core/
│  ├─ api/          ExpenseService, MasterDataService (HttpClient)
│  ├─ auth/         DemoAuthService (Signal), Interceptor (X-Demo-User), authGuard
│  ├─ layout/       Shell mit Navigation
│  └─ models.ts     Typen, gespiegelt vom Backend
├─ features/
│  ├─ login/        Demo-Login
│  └─ expenses/     expense-list, expense-form, expense-detail
└─ shared/          StatusChip, MoneyPipe, Statuslabels
```

- Standalone, lazy Routen, Zoneless (ADR-0001)
- Route-Parameter als Inputs (`withComponentInputBinding`)
- Tests: Vitest über `ng test`

## Backend (`backend/`)

```
src/
├─ common/        DemoUserGuard (global), @Public, @CurrentUser
├─ data/          DataStoreService (lädt Seed, ADR-0003)
├─ domain/        Typen und Wechselkurse
├─ users/ categories/ cost-centers/ expenses/ approvals/
└─ setup-app.ts   Präfix /api, ValidationPipe (auch in e2e-Tests genutzt)
```

## API-Überblick

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/users` | Demo-Nutzer (öffentlich) |
| GET | `/api/users/me` | Aktueller Nutzer |
| GET | `/api/categories` | Kategorien |
| GET | `/api/cost-centers` | Kostenstellen, flach mit `parentId` (ADR-0005) |
| GET | `/api/expenses` | Eigene Ausgaben, `page`, `pageSize`, `sort=date\|amount`, `order=asc\|desc` |
| GET | `/api/expenses/:id` | Eine Ausgabe |
| POST | `/api/expenses` | Anlegen (Entwurf oder mit `submit: true` einreichen) |
| PATCH | `/api/expenses/:id` | Entwurf ändern |
| POST | `/api/expenses/:id/submit` | Entwurf einreichen |
| DELETE | `/api/expenses/:id` | Entwurf löschen |
| GET | `/api/approvals/pending` | Offene Einreichungen der eigenen Kostenstellen |
| POST | `/api/approvals/:id/approve` | Genehmigen |

Vollständig und aktuell: http://localhost:3000/api/docs

## Datenmodell

Eine Ausgabe hat Betrag und Währung (EUR, CHF, USD) sowie den umgerechneten Betrag `amountEur` (feste Kurse in `domain/types.ts`).
Statusfluss: `DRAFT → SUBMITTED → APPROVED → PAID` oder `SUBMITTED → REJECTED`.

## Demo-Nutzer

| ID | Name | Rolle | Kostenstelle |
|---|---|---|---|
| u-01 | Anna Becker | Mitarbeiterin | 1110 Vertrieb Nord |
| u-02 | Lukas Wagner | Mitarbeiter | 1210 Softwareentwicklung |
| u-03 | Mehmet Yilmaz | Mitarbeiter | 1120 Vertrieb Süd |
| u-04 | Julia Schröder | Mitarbeiterin | 1220 IT-Betrieb |
| u-05 | Felix Hoffmann | Mitarbeiter | 1320 Personal |
| u-06 | Claudia Richter | Genehmigende (Vertrieb) | 1100 Vertrieb |
| u-07 | Stefan Krüger | Genehmigender (IT) | 1200 IT |
| u-08 | Petra Neumann | Buchhaltung | 1310 Buchhaltung |

## Design-Tokens

Farben und Typografie stehen als CSS-Variablen in `frontend/src/styles.scss` (`--nw-*`). Beträge immer mit `font-variant-numeric: tabular-nums` und rechtsbündig.

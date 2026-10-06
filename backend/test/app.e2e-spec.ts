import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { setupApp } from './../src/setup-app.js';

describe('Spesenportal API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/users ist ohne Login erreichbar', () => {
    return request(app.getHttpServer()).get('/api/users').expect(200);
  });

  it('GET /api/expenses ohne Demo-Nutzer → 401', () => {
    return request(app.getHttpServer()).get('/api/expenses').expect(401);
  });

  it('GET /api/expenses mit Demo-Nutzer → Seite mit Ausgaben', async () => {
    const res = await request(app.getHttpServer()).get('/api/expenses?pageSize=5').set('X-Demo-User', 'u-01').expect(200);
    expect(res.body.items).toHaveLength(5);
  });

  it('POST /api/expenses validiert den Betrag', () => {
    return request(app.getHttpServer())
      .post('/api/expenses')
      .set('X-Demo-User', 'u-01')
      .send({ date: '2026-09-21', categoryId: 'cat-02', amount: -5, currency: 'EUR', costCenterId: 'cc-1110', description: 'Test' })
      .expect(400);
  });

  describe('PATCH /api/expenses/:id', () => {
    const draft = { date: '2026-09-21', categoryId: 'cat-02', amount: 10, currency: 'EUR', costCenterId: 'cc-1110', description: 'Entwurf' };

    const createDraft = async (): Promise<string> => {
      const res = await request(app.getHttpServer()).post('/api/expenses').set('X-Demo-User', 'u-01').send(draft).expect(201);
      return res.body.id;
    };
    const patch = (id: string, body: object) =>
      request(app.getHttpServer()).patch(`/api/expenses/${id}`).set('X-Demo-User', 'u-01').send(body);

    it('ändert einzelne Felder und berechnet amountEur neu', async () => {
      const id = await createDraft();
      const res = await patch(id, { amount: 20, description: 'Geändert' }).expect(200);
      expect(res.body).toMatchObject({ id, amount: 20, amountEur: 20, description: 'Geändert', categoryId: 'cat-02' });
    });

    it('verwirft unbekannte Felder', async () => {
      const id = await createDraft();
      const res = await patch(id, { description: 'Neu', status: 'APPROVED', employeeId: 'u-02' }).expect(200);
      expect(res.body.status).toBe('DRAFT');
      expect(res.body.employeeId).toBe('u-01');
    });

    it.each([
      ['negativer Betrag', { amount: -5 }],
      ['Betrag als String', { amount: 'viel' }],
      ['ungültige Währung', { currency: 'GBP' }],
      ['ungültiges Datum', { date: '21.09.2026' }],
      ['zu lange Beschreibung', { description: 'x'.repeat(201) }],
      ['unbekannte Kategorie', { categoryId: 'cat-xx' }],
      ['unbekannte Kostenstelle', { costCenterId: 'cc-xx' }],
    ])('lehnt %s ab → 400', async (_name, body) => {
      const id = await createDraft();
      await patch(id, body).expect(400);
    });

    it('lehnt Änderung einer eingereichten Ausgabe ab → 400', async () => {
      const id = await createDraft();
      await request(app.getHttpServer()).post(`/api/expenses/${id}/submit`).set('X-Demo-User', 'u-01').expect(200);
      await patch(id, { description: 'Zu spät' }).expect(400);
    });
  });
});

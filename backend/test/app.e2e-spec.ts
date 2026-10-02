import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { setupApp } from './../src/setup-app.js';

describe('Spesenportal API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
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
    const res = await request(app.getHttpServer())
      .get('/api/expenses?pageSize=5')
      .set('X-Demo-User', 'u-01')
      .expect(200);
    expect(res.body.items).toHaveLength(5);
  });

  it('POST /api/expenses validiert den Betrag', () => {
    return request(app.getHttpServer())
      .post('/api/expenses')
      .set('X-Demo-User', 'u-01')
      .send({
        date: '2026-09-21',
        categoryId: 'cat-02',
        amount: -5,
        currency: 'EUR',
        costCenterId: 'cc-1110',
        description: 'Test',
      })
      .expect(400);
  });

  describe('POST /api/approvals/:id/reject', () => {
    const reject = (id: string, user: string, body: unknown) =>
      request(app.getHttpServer())
        .post(`/api/approvals/${id}/reject`)
        .set('X-Demo-User', user)
        .send(body as object);

    it('lehnt eingereichte Ausgabe mit Begründung ab', async () => {
      const res = await reject('exp-0111', 'u-06', {
        reason: 'Beleg fehlt',
      }).expect(200);
      expect(res.body).toMatchObject({
        id: 'exp-0111',
        status: 'REJECTED',
        rejectionReason: 'Beleg fehlt',
        decidedBy: 'u-06',
      });
      expect(res.body.decidedAt).toEqual(expect.any(String));
    });

    it('verlangt eine Begründung', async () => {
      await reject('exp-0111', 'u-06', {}).expect(400);
    });

    it('verlangt mindestens 5 Zeichen (auch nach Trim)', async () => {
      await reject('exp-0111', 'u-06', { reason: 'Nein' }).expect(400);
      await reject('exp-0111', 'u-06', { reason: '   ab   ' }).expect(400);
      await reject('exp-0111', 'u-06', { reason: 'fünf!' }).expect(200);
    });

    it('akzeptiert 300, lehnt 301 Zeichen ab', async () => {
      await reject('exp-0111', 'u-06', { reason: 'x'.repeat(301) }).expect(400);
      await reject('exp-0111', 'u-06', { reason: 'x'.repeat(300) }).expect(200);
    });

    it('lehnt nur Status SUBMITTED ab', async () => {
      await reject('exp-0111', 'u-06', { reason: 'Beleg fehlt' }).expect(200);
      await reject('exp-0111', 'u-06', { reason: 'Beleg fehlt' }).expect(400);
    });

    it('verweigert Nutzern ohne Rolle APPROVER (403) und unbekannte IDs (404)', async () => {
      await reject('exp-0111', 'u-01', { reason: 'Beleg fehlt' }).expect(403);
      await reject('exp-9999', 'u-06', { reason: 'Beleg fehlt' }).expect(404);
    });
  });
});

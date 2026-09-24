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
});

import { INestApplication, ValidationPipe } from '@nestjs/common';

/** Gemeinsame App-Konfiguration für main.ts und e2e-Tests. */
export function setupApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
}

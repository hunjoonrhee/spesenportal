import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { setupApp } from './setup-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);

  const config = new DocumentBuilder()
    .setTitle('Spesenportal API')
    .setDescription('Nordwerk AG – Reisekosten und Spesen. Demo-Auth über Header X-Demo-User (z. B. u-01).')
    .setVersion('0.7.0')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Spesenportal API läuft auf http://localhost:${port}/api (Docs: /api/docs)`);
}
await bootstrap();

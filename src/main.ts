import { NestFactory, NestApplication } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

let app: NestApplication;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT')

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      forbidNonWhitelisted: false, // throw an error instead of strip props
      disableErrorMessages: false,
      whitelist: true, // strip the not defined properties from DTOs
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  console.log('Listen on port ' + port);
  await app.listen(port);
}

bootstrap().catch((error: unknown) => {
  console.error('Bootstrapping application failed!', error);
});

// handle graceful shutdown
async function gracefulShutdown(): Promise<void> {
  if (app !== undefined) {
    await app.close();
  }
  process.exit(0);
}

process.once('SIGTERM', async () => {
  await gracefulShutdown();
});

process.once('SIGINT', async () => {
  await gracefulShutdown();
});


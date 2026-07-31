import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DomainExpectionFilter } from './core/shared/infra/filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3002

  app.useGlobalFilters(new DomainExpectionFilter())

  await app.listen(port);

  Logger.log(`Application runnig on localhost: ${port}`, 'Application Started',)
}
bootstrap();

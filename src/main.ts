import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { BaseConfiguration } from './modules/app-config/base-config.service';
import { HttpExceptionFilter } from './exceptions-filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const baseConfig = app.get(BaseConfiguration);
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(baseConfig.apiPort);
}
bootstrap();

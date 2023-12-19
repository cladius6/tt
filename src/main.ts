import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { BaseConfiguration } from './modules/app-config/base-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const baseConfig = app.get(BaseConfiguration);

  await app.listen(baseConfig.apiPort);
}
bootstrap();

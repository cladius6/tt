import { Injectable } from '@nestjs/common';
import { z } from 'nestjs-zod/z';
import { ConfigService } from '@nestjs/config';

const StorageEnvVariablesSchema = z.object({
  MONGODB_URI: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.number(),
});

type StorageEnvVariables = z.infer<typeof StorageEnvVariablesSchema>;

@Injectable()
export class StorageConfiguration {
  readonly mongoDbUri: string;
  readonly redisHost: string;
  readonly redisPort: number;

  constructor(readonly configService: ConfigService<StorageEnvVariables>) {
    const config = StorageEnvVariablesSchema.parse({
      MONGODB_URI: configService.get('MONGODB_URI'),
      REDIS_HOST: configService.get('REDIS_HOST'),
      REDIS_PORT: Number(configService.get('REDIS_PORT')),
    });

    this.mongoDbUri = config.MONGODB_URI;
    this.redisHost = config.REDIS_HOST;
    this.redisPort = config.REDIS_PORT;
  }
}

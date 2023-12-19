import { Injectable } from '@nestjs/common';
import { z } from 'nestjs-zod/z';
import { ConfigService } from '@nestjs/config';

const StorageEnvVariablesSchema = z.object({
  MONGODB_URI: z.string(),
  REDIS_URI: z.string(),
});

type StorageEnvVariables = z.infer<typeof StorageEnvVariablesSchema>;

@Injectable()
export class StorageConfiguration {
  readonly mongoDbUri: string;
  readonly redisUri: string;

  constructor(readonly configService: ConfigService<StorageEnvVariables>) {
    const config = StorageEnvVariablesSchema.parse({
      MONGODB_URI: configService.get('MONGODB_URI'),
      REDIS_URI: configService.get('REDIS_URI'),
    });

    this.mongoDbUri = config.MONGODB_URI;
    this.redisUri = config.REDIS_URI;
  }
}

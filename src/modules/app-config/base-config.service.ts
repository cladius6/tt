import { Injectable } from '@nestjs/common';
import { z } from 'nestjs-zod/z';
import { ConfigService } from '@nestjs/config';

const BaseEnvVariablesSchema = z.object({
  API_PORT: z.number(),
});

type BaseEnvVariables = z.infer<typeof BaseEnvVariablesSchema>;

@Injectable()
export class BaseConfiguration {
  readonly apiPort: number;

  constructor(readonly configService: ConfigService<BaseEnvVariables>) {
    const config = BaseEnvVariablesSchema.parse({
      API_PORT: Number(configService.get('API_PORT')),
    });

    this.apiPort = config.API_PORT;
  }
}

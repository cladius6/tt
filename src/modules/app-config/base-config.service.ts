import { Injectable } from '@nestjs/common';
import { z } from 'nestjs-zod/z';
import { ConfigService } from '@nestjs/config';

const BaseEnvVariablesSchema = z.object({
  API_PORT: z.number(),
  JWT_SECRET: z.string(),
});

type BaseEnvVariables = z.infer<typeof BaseEnvVariablesSchema>;

@Injectable()
export class BaseConfiguration {
  readonly apiPort: number;
  readonly jwtSecret: string;

  constructor(readonly configService: ConfigService<BaseEnvVariables>) {
    const config = BaseEnvVariablesSchema.parse({
      API_PORT: Number(configService.get('API_PORT')),
      JWT_SECRET: configService.get('JWT_SECRET'),
    });

    this.apiPort = config.API_PORT;
    this.jwtSecret = config.JWT_SECRET;
  }
}

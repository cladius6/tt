import { Global, Module } from '@nestjs/common';
import { ThrottlerConfiguration } from './throttler-config.service';
import { StorageConfiguration } from './storage-config.service';
import { BaseConfiguration } from './base-config.service';

@Global()
@Module({
  providers: [BaseConfiguration, ThrottlerConfiguration, StorageConfiguration],
  exports: [BaseConfiguration, ThrottlerConfiguration, StorageConfiguration],
})
export class AppConfigModule {}

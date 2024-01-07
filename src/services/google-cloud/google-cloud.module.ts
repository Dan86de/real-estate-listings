import { Module } from '@nestjs/common';
import { GoogleCloudService } from './google-cloud.service';
import { UidModule } from '../uid/uid.module';

@Module({
  imports: [UidModule],
  providers: [GoogleCloudService],
  exports: [GoogleCloudService],
})
export class GoogleCloudModule {}

import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { UidService } from '../uid/uid.service';

@Injectable()
export class GoogleCloudService {
  private storage: Storage;
  constructor(
    private readonly configService: ConfigService,
    private readonly uidService: UidService,
  ) {}
  onModuleInit() {
    this.storage = new Storage({
      projectId: this.configService.getOrThrow('gcp.projectId'),
      credentials: {
        client_email: this.configService.get('gcp.clientEmail'),
        private_key: this.configService.get('gcp.privateKey'),
      },
    });
  }
  async uploadFile(bucketName: string, buffer: Buffer, mimeType: string) {
    const bucket = this.storage.bucket(bucketName);
    const fileName = this.uidService.generate();
    const file = bucket.file(fileName);
    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
      gzip: true,
    });
    await file.makePublic();
    return file.publicUrl();
  }
}

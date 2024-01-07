import { HttpServer, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import helmet from 'helmet';
import { AppModule } from '../src/app.module';
import { CacheService } from '../src/core/cache/cache.service';
import { DatabaseService } from '../src/database/database.service';
import { GoogleCloudService } from '../src/services/google-cloud/google-cloud.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Queue } from 'bull';
import { LISTING_QUEUE } from '../src/core/queue/queue.constants';

let app: INestApplication;
let server: HttpServer;
let moduleFixture: TestingModule;
let cache: CacheService;
let database: DatabaseService;
let googleCloudService: DeepMocked<GoogleCloudService>;
let listingQueue: Queue;

beforeAll(async () => {
  moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: GoogleCloudService,
        useValue: createMock<GoogleCloudService>(),
      },
    ],
  }).compile();

  // Apply consistent set up to main.ts
  app = moduleFixture.createNestApplication();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Get instances of services
  cache = moduleFixture.get<CacheService>(CacheService);
  database = moduleFixture.get<DatabaseService>(DatabaseService);
  googleCloudService = moduleFixture.get(GoogleCloudService);
  googleCloudService.uploadFile = jest
    .fn()
    .mockResolvedValue('https://storage.googleapis.com/image-url');
  listingQueue = moduleFixture.get<Queue>(`BullQueue_${LISTING_QUEUE}`);
  await app.init();
  server = app.getHttpServer();
});

afterEach(async () => {
  await database.resetDb();
  await cache.reset();
});

afterAll(async () => {
  await app.close();
});

export { app, server, listingQueue };

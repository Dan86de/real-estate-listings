import { OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';

export abstract class BaseConsumer {
  @OnQueueFailed()
  async onError(job: Job<any>, error: any) {
    console.error(
      `Error processing job ${job.name} with data ${job.data}`,
      error,
    );
  }
}

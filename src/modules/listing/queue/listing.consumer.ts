import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  CREATE_LISTING_IMAGE,
  LISTING_QUEUE,
} from '../../../core/queue/queue.constants';
import { BaseConsumer } from '../../../core/queue/base.consumer';
import { CreateListingImageDto } from '../dto/create-listinig-image.dto';
import { FileService } from '../../../utilities/file/file.service';

@Processor(LISTING_QUEUE)
export class ListingConsumer extends BaseConsumer {
  constructor(private readonly fileService: FileService) {
    super();
  }

  @Process(CREATE_LISTING_IMAGE)
  async createListingImage(job: Job<CreateListingImageDto>) {
    const buffer = this.fileService.base64ToBuffer(job.data.base64String);
    // upload file to GCS
    // save a reference to the file in the database
    console.log(`FILE PROCESSED ASYNC IN QUEUE`);
  }
}

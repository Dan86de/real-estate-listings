import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  CREATE_LISTING_IMAGE,
  LISTING_QUEUE,
} from '../../../core/queue/queue.constants';
import { BaseConsumer } from '../../../core/queue/base.consumer';
import { CreateListingImageDto } from '../dto/create-listinig-image.dto';
import { ListingService } from '../listing.service';

@Processor(LISTING_QUEUE)
export class ListingConsumer extends BaseConsumer {
  constructor(private readonly listingService: ListingService) {
    super();
  }

  @Process(CREATE_LISTING_IMAGE)
  async createListingImage(job: Job<CreateListingImageDto>) {
    await this.listingService.createListingImage(job.data);
  }
}

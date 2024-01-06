import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  CREATE_LISTING_IMAGE,
  LISTING_QUEUE,
} from '../../../core/queue/queue.constants';
import { CreateListingImageDto } from '../dto/create-listinig-image.dto';

@Injectable()
export class ListingProducer {
  constructor(@InjectQueue(LISTING_QUEUE) private queue: Queue) {}

  async createListingImage(payload: CreateListingImageDto) {
    return await this.queue.add(CREATE_LISTING_IMAGE, payload);
  }
}

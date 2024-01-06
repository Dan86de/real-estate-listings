import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { BullModule } from '@nestjs/bull';
import { ListingConsumer } from './queue/listing.consumer';
import { ListingProducer } from './queue/listing.producer';
import { LISTING_QUEUE } from '../../core/queue/queue.constants';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { UtilitiesModule } from '../../utilities/utilities.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: LISTING_QUEUE }),
    BullBoardModule.forFeature({ name: LISTING_QUEUE, adapter: BullAdapter }),
    UtilitiesModule,
  ],
  controllers: [ListingController],
  providers: [ListingService, ListingConsumer, ListingProducer],
})
export class ListingModule {}

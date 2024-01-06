import { Injectable } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { DatabaseService } from '../../database/database.service';
import { ListingProducer } from './queue/listing.producer';
import { FileService } from '../../utilities/file/file.service';

@Injectable()
export class ListingService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly listingProducer: ListingProducer,
    private readonly fileService: FileService,
  ) {}
  async create({
    data,
    images,
  }: {
    data: CreateListingDto;
    images: Express.Multer.File[];
  }) {
    const listing = await this.dbService.listing.create({
      data,
    });

    for (const image of images) {
      await this.listingProducer.createListingImage({
        base64String: this.fileService.bufferToBase64(image.buffer),
        mimeType: image.mimetype,
        listingId: listing.id,
      });
    }

    return listing;
  }
}

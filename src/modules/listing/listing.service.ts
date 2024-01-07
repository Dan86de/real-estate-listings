import { Injectable } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { DatabaseService } from '../../database/database.service';
import { ListingProducer } from './queue/listing.producer';
import { FileService } from '../../utilities/file/file.service';
import { CreateListingImageDto } from './dto/create-listinig-image.dto';
import { ConfigService } from '@nestjs/config';
import { GoogleCloudService } from '../../services/google-cloud/google-cloud.service';

@Injectable()
export class ListingService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly listingProducer: ListingProducer,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
    private readonly googleCloudService: GoogleCloudService,
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

  async createListingImage({
    base64String,
    mimeType,
    listingId,
  }: CreateListingImageDto) {
    const buffer = this.fileService.base64ToBuffer(base64String);
    const bucketName = this.configService.getOrThrow(
      'gcp.buckets.listingImages',
    );
    const publicImageUrl = await this.googleCloudService.uploadFile(
      bucketName,
      buffer,
      mimeType,
    );

    return this.dbService.listingImage.create({
      data: {
        url: publicImageUrl,
        listingId: listingId,
      },
    });
  }
}

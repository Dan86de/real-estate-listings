import { ListingService } from './listing.service';
import { app, listingQueue } from '../../../test/setup';
import { DatabaseService } from '../../database/database.service';
import { generateListingImages, generatePayload } from './__test__/test-utils';
import { FileService } from '../../utilities/file/file.service';

describe('ListingService Integration Tests', () => {
  let listingService: ListingService;
  let databaseService: DatabaseService;
  let fileService: FileService;

  beforeEach(() => {
    listingService = app.get(ListingService);
    databaseService = app.get(DatabaseService);
    fileService = app.get(FileService);
  });

  describe('create', () => {
    it('should create listing (no images)', async () => {
      // test side effects record added in db
      // test the end result
      const payload = generatePayload();
      const result = await listingService.create({ data: payload, images: [] });
      const databaseRecord = await databaseService.listing.findUnique({
        where: { id: result.id },
      });
      expect(result).toEqual(databaseRecord);
    });

    it(`should create a listing with images`, async () => {
      const payload = generatePayload();
      const images = generateListingImages();
      const listing = await listingService.create({
        data: payload,
        images,
      });
      // wait for jobs to finish processing
      let inProcessJobs = await listingQueue.getJobs([`active`]);
      while (inProcessJobs.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        inProcessJobs = await listingQueue.getJobs([`active`]);
      }

      const persistedListing = await databaseService.listing.findUnique({
        where: {
          id: listing.id,
        },
      });
      const persistedImages = await databaseService.listingImage.findMany({
        where: {
          listingId: listing.id,
        },
      });
      expect(listing).toEqual(persistedListing);
      expect(persistedImages.length).toBe(3);
    });
  });
  describe('createListingImage', () => {
    it('should create a listing image', async () => {
      const payload = generatePayload();
      const listing = await databaseService.listing.create({ data: payload });
      const image = generateListingImages()[0] as Express.Multer.File;
      const result = await listingService.createListingImage({
        base64String: fileService.bufferToBase64(image.buffer),
        mimeType: image.mimetype,
        listingId: listing.id,
      });
      const databaseRecord = await databaseService.listingImage.findUnique({
        where: { id: result.id },
      });
      expect(result).toEqual(databaseRecord);
    });
  });
});

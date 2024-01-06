import { IsNotEmpty, IsString } from 'class-validator';

export class CreateListingImageDto {
  @IsString()
  @IsNotEmpty()
  base64String: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  listingId: string;
}

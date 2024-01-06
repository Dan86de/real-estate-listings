import { Listing } from '@prisma/client';

export type CreateListingInput = Omit<
  Listing,
  'id' | 'createdAt' | 'updatedAt'
>;

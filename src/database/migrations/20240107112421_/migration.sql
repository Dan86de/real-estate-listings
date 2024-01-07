/*
  Warnings:

  - The primary key for the `ListingImage` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ListingImage" DROP CONSTRAINT "ListingImage_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ListingImage_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ListingImage_id_seq";

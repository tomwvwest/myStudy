/*
  Warnings:

  - The `contents` column on the `CardSets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CardSets" DROP COLUMN "contents",
ADD COLUMN     "contents" JSONB[];

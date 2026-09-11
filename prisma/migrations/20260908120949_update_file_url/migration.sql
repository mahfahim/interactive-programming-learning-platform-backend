/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `assignment_submissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assignment_submissions" DROP COLUMN "fileUrl",
ADD COLUMN     "fileUrls" TEXT[];

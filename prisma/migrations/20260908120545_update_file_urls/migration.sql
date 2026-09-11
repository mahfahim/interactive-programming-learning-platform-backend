/*
  Warnings:

  - The `fileUrl` column on the `assignment_submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "assignment_submissions" DROP COLUMN "fileUrl",
ADD COLUMN     "fileUrl" TEXT[];

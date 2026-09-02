/*
  Warnings:

  - You are about to drop the `module_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `super_module_assignments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[lessonId]` on the table `assignments` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `content` on the `article_sections` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `dueDate` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonId` to the `assignments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "module_assignments" DROP CONSTRAINT "module_assignments_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "module_assignments" DROP CONSTRAINT "module_assignments_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "super_module_assignments" DROP CONSTRAINT "super_module_assignments_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "super_module_assignments" DROP CONSTRAINT "super_module_assignments_superModuleId_fkey";

-- AlterTable
ALTER TABLE "article_sections" DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lessonId" TEXT NOT NULL;

-- DropTable
DROP TABLE "module_assignments";

-- DropTable
DROP TABLE "super_module_assignments";

-- CreateIndex
CREATE UNIQUE INDEX "assignments_lessonId_key" ON "assignments"("lessonId");

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

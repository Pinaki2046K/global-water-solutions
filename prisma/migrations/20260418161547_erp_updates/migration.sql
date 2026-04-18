/*
  Warnings:

  - You are about to drop the column `installationDate` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "installationDate" TIMESTAMP(3),
ADD COLUMN     "plantModelName" TEXT,
ADD COLUMN     "warrantyPeriod" TEXT;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "installationDate",
ADD COLUMN     "serviceCompleteDate" TIMESTAMP(3),
ADD COLUMN     "serviceRegisterDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "nextServiceDueDate" SET DEFAULT now() + interval '3 months';

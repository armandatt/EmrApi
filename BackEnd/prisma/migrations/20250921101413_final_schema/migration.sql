/*
  Warnings:

  - You are about to drop the column `created_at` on the `InputCode` table. All the data in the column will be lost.
  - You are about to drop the column `input_id` on the `InputCode` table. All the data in the column will be lost.
  - You are about to drop the `PatientInput` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `source` on the `Disease` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `patientId` to the `InputCode` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Source" AS ENUM ('ICD11', 'NAMASTE', 'BOTH');

-- DropForeignKey
ALTER TABLE "public"."InputCode" DROP CONSTRAINT "InputCode_input_id_fkey";

-- AlterTable
ALTER TABLE "public"."Disease" DROP COLUMN "source",
ADD COLUMN     "source" "public"."Source" NOT NULL;

-- AlterTable
ALTER TABLE "public"."InputCode" DROP COLUMN "created_at",
DROP COLUMN "input_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "patientId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."PatientInput";

-- CreateTable
CREATE TABLE "public"."DiseaseMapping" (
    "id" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,
    "icd11Code" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL,
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiseaseMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Patient" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "givenName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Disease_icd11Code_idx" ON "public"."Disease"("icd11Code");

-- CreateIndex
CREATE INDEX "Disease_namasteCode_idx" ON "public"."Disease"("namasteCode");

-- CreateIndex
CREATE INDEX "InputCode_patientId_idx" ON "public"."InputCode"("patientId");

-- AddForeignKey
ALTER TABLE "public"."DiseaseMapping" ADD CONSTRAINT "DiseaseMapping_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "public"."Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InputCode" ADD CONSTRAINT "InputCode_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

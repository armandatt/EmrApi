-- AlterTable
ALTER TABLE "public"."InputCode" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" INTEGER;

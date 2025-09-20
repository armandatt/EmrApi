-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Disease" (
    "id" TEXT NOT NULL,
    "icd11Code" TEXT,
    "namasteCode" TEXT,
    "description" TEXT,
    "source" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DiseaseName" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT,
    "diseaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiseaseName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PatientInput" (
    "input_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientInput_pkey" PRIMARY KEY ("input_id")
);

-- CreateTable
CREATE TABLE "public"."InputCode" (
    "code_id" SERIAL NOT NULL,
    "input_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InputCode_pkey" PRIMARY KEY ("code_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_icd11Code_key" ON "public"."Disease"("icd11Code");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_namasteCode_key" ON "public"."Disease"("namasteCode");

-- AddForeignKey
ALTER TABLE "public"."DiseaseName" ADD CONSTRAINT "DiseaseName_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "public"."Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InputCode" ADD CONSTRAINT "InputCode_input_id_fkey" FOREIGN KEY ("input_id") REFERENCES "public"."PatientInput"("input_id") ON DELETE CASCADE ON UPDATE CASCADE;

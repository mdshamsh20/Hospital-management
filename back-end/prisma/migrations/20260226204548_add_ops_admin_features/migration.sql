/*
  Warnings:

  - You are about to drop the `RadiologyCase` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ClinicSettings" ADD COLUMN     "doctorComm" DOUBLE PRECISION NOT NULL DEFAULT 60,
ADD COLUMN     "referralComm" DOUBLE PRECISION NOT NULL DEFAULT 10;

-- DropTable
DROP TABLE "RadiologyCase";

-- CreateTable
CREATE TABLE "SampleCollection" (
    "id" SERIAL NOT NULL,
    "patientName" TEXT NOT NULL,
    "sampleType" TEXT NOT NULL,
    "sampleId" TEXT NOT NULL,
    "collectionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalLab" TEXT,
    "collectedBy" TEXT,
    "amountCollected" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "labPayment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "margin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Collected',

    CONSTRAINT "SampleCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionRecord" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER,
    "doctorName" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "totalBilling" DOUBLE PRECISION NOT NULL,
    "commissionAmount" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "month" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "CommissionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SampleCollection_sampleId_key" ON "SampleCollection"("sampleId");

-- CreateIndex
CREATE UNIQUE INDEX "CommissionRecord_appointmentId_key" ON "CommissionRecord"("appointmentId");

/*
  Warnings:

  - You are about to drop the column `name` on the `ProposalItem` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ProposalItem` table. All the data in the column will be lost.
  - Added the required column `normalizedKey` to the `ProposalItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawText` to the `ProposalItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProposalStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "ProposalStatus" ADD VALUE 'FAILED';
ALTER TYPE "ProposalStatus" ADD VALUE 'QUEUE_FAILED';

-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "aiModelUsed" TEXT,
ADD COLUMN     "analysisDurationMs" INTEGER,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Proposta sem nome',
ADD COLUMN     "processedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProposalAnalysis" ADD COLUMN     "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "differentiators" JSONB,
ADD COLUMN     "gaps" JSONB,
ADD COLUMN     "risks" JSONB,
ADD COLUMN     "strengths" JSONB,
ADD COLUMN     "weaknesses" JSONB;

-- AlterTable
ALTER TABLE "ProposalItem" DROP COLUMN "name",
DROP COLUMN "status",
ADD COLUMN     "included" BOOLEAN,
ADD COLUMN     "normalizedKey" TEXT NOT NULL,
ADD COLUMN     "rawText" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "estimatedValue" DECIMAL(10,2),
ADD COLUMN     "notes" TEXT;

-- DropEnum
DROP TYPE "ProposalItemStatus";

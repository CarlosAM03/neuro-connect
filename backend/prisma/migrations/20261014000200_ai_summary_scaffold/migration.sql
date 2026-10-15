-- CreateEnum
CREATE TYPE "AISummaryStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "AISummary" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "periodStart" TIMESTAMPTZ(3) NOT NULL,
    "periodEnd" TIMESTAMPTZ(3) NOT NULL,
    "inputSnapshot" JSONB NOT NULL,
    "content" TEXT,
    "provider" TEXT,
    "model" TEXT,
    "status" "AISummaryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AISummary_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AISummary_period_check" CHECK ("periodStart" <= "periodEnd")
);

-- CreateIndex
CREATE INDEX "AISummary_userId_idx" ON "AISummary"("userId");

-- CreateIndex
CREATE INDEX "AISummary_userId_createdAt_idx" ON "AISummary"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "AISummary" ADD CONSTRAINT "AISummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

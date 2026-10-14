CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED');
CREATE TYPE "CheckInCompletion" AS ENUM ('NOT_MET', 'PARTIAL', 'MET');
CREATE TABLE "User" (
  "id" UUID NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Goal" (
  "id" UUID NOT NULL,
  "ownerId" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
  "progress" INTEGER NOT NULL DEFAULT 0,
  "targetDate" TIMESTAMPTZ(3),
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "Goal_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Goal_progress_check" CHECK ("progress" BETWEEN 0 AND 100)
);
CREATE TABLE "CheckIn" (
  "id" UUID NOT NULL,
  "goalId" UUID NOT NULL,
  "progress" INTEGER NOT NULL,
  "difficulty" INTEGER NOT NULL,
  "completion" "CheckInCompletion" NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CheckIn_progress_check" CHECK ("progress" BETWEEN 0 AND 100),
  CONSTRAINT "CheckIn_difficulty_check" CHECK ("difficulty" BETWEEN 1 AND 5)
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Goal_ownerId_idx" ON "Goal"("ownerId");
CREATE INDEX "Goal_ownerId_status_idx" ON "Goal"("ownerId", "status");
CREATE INDEX "CheckIn_goalId_idx" ON "CheckIn"("goalId");
CREATE INDEX "CheckIn_goalId_createdAt_idx" ON "CheckIn"("goalId", "createdAt");
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

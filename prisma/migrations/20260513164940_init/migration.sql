-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT,
    "principalName" TEXT NOT NULL,
    "udaiseCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "schoolName" TEXT,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "studentTeamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentTeam" (
    "id" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "teamId" TEXT,
    "studentTeam" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastUpdated" TEXT NOT NULL,
    "stageData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "stage" TEXT,
    "fromStage" TEXT,
    "toStage" TEXT,
    "content" TEXT,
    "author" TEXT,
    "timestamp" TEXT NOT NULL,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemeActivity" (
    "id" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "schoolName" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThemeActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_name_key" ON "School"("name");

-- CreateIndex
CREATE UNIQUE INDEX "School_udaiseCode_key" ON "School"("udaiseCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "StudentTeam_schoolName_idx" ON "StudentTeam"("schoolName");

-- CreateIndex
CREATE INDEX "Idea_schoolName_idx" ON "Idea"("schoolName");

-- CreateIndex
CREATE INDEX "Idea_teamId_idx" ON "Idea"("teamId");

-- CreateIndex
CREATE INDEX "TimelineEvent_ideaId_idx" ON "TimelineEvent"("ideaId");

-- CreateIndex
CREATE INDEX "ThemeActivity_month_idx" ON "ThemeActivity"("month");

-- CreateIndex
CREATE INDEX "ThemeActivity_year_idx" ON "ThemeActivity"("year");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_studentTeamId_fkey" FOREIGN KEY ("studentTeamId") REFERENCES "StudentTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTeam" ADD CONSTRAINT "StudentTeam_schoolName_fkey" FOREIGN KEY ("schoolName") REFERENCES "School"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_schoolName_fkey" FOREIGN KEY ("schoolName") REFERENCES "School"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "StudentTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

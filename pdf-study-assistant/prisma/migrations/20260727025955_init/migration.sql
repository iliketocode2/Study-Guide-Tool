-- CreateTable
CREATE TABLE "StudySet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "studySetId" TEXT NOT NULL,
    CONSTRAINT "Flashcard_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "studySetId" TEXT NOT NULL,
    CONSTRAINT "QuizQuestion_studySetId_fkey" FOREIGN KEY ("studySetId") REFERENCES "StudySet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

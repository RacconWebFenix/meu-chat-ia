/*
  Warnings:

  - You are about to drop the column `userInputHeaders` on the `ChatRequest` table. All the data in the column will be lost.
  - You are about to drop the column `userInputRow` on the `ChatRequest` table. All the data in the column will be lost.
  - Added the required column `prompt` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `response` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatRequest" DROP COLUMN "userInputHeaders",
DROP COLUMN "userInputRow";

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "response" TEXT NOT NULL;

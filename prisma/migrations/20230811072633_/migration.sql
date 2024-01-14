/*
  Warnings:

  - You are about to drop the column `hashTag` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `repeat` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "hashTag";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "repeat",
ADD COLUMN     "isVerify" BOOLEAN NOT NULL DEFAULT false;

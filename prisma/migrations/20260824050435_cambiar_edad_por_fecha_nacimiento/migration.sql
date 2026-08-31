/*
  Warnings:

  - You are about to drop the column `edad` on the `Mascota` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mascota" DROP COLUMN "edad",
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3);

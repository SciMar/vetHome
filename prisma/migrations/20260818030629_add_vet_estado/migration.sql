-- CreateEnum
CREATE TYPE "VetEstado" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- AlterTable
ALTER TABLE "Veterinario" ADD COLUMN     "estado" "VetEstado" NOT NULL DEFAULT 'PENDIENTE';

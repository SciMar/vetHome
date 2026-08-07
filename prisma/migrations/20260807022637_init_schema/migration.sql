/*
  Warnings:

  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PetOwnerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TriageSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VetProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'VETERINARIAN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "CitaStatus" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_petId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_triageSessionId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_vetProfileId_fkey";

-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_ownerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "PetOwnerProfile" DROP CONSTRAINT "PetOwnerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "TriageSession" DROP CONSTRAINT "TriageSession_petId_fkey";

-- DropForeignKey
ALTER TABLE "VetProfile" DROP CONSTRAINT "VetProfile_userId_fkey";

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "Pet";

-- DropTable
DROP TABLE "PetOwnerProfile";

-- DropTable
DROP TABLE "TriageSession";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VetProfile";

-- DropEnum
DROP TYPE "AppointmentStatus";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "UrgencyLevel";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veterinario" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "numeroColegiado" TEXT NOT NULL,
    "tarjetaProfesional" TEXT,
    "calificacionPromedio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Veterinario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinica" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT,
    "horario" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VetClinica" (
    "id" TEXT NOT NULL,
    "vetId" TEXT NOT NULL,
    "clinicaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VetClinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mascota" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raza" TEXT,
    "edad" INTEGER,
    "peso" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoriaMedica" (
    "id" TEXT NOT NULL,
    "mascotaId" TEXT NOT NULL,
    "vacunas" TEXT,
    "alergias" TEXT,
    "condiciones" TEXT,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoriaMedica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cita" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "vetId" TEXT NOT NULL,
    "mascotaId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "status" "CitaStatus" NOT NULL DEFAULT 'PENDIENTE',
    "notas" TEXT,
    "diagnostico" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "vetId" TEXT NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_role_idx" ON "Usuario"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Veterinario_userId_key" ON "Veterinario"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Veterinario_cedula_key" ON "Veterinario"("cedula");

-- CreateIndex
CREATE INDEX "Veterinario_cedula_idx" ON "Veterinario"("cedula");

-- CreateIndex
CREATE INDEX "Clinica_nombre_idx" ON "Clinica"("nombre");

-- CreateIndex
CREATE INDEX "VetClinica_vetId_idx" ON "VetClinica"("vetId");

-- CreateIndex
CREATE INDEX "VetClinica_clinicaId_idx" ON "VetClinica"("clinicaId");

-- CreateIndex
CREATE UNIQUE INDEX "VetClinica_vetId_clinicaId_key" ON "VetClinica"("vetId", "clinicaId");

-- CreateIndex
CREATE INDEX "Mascota_userId_idx" ON "Mascota"("userId");

-- CreateIndex
CREATE INDEX "Mascota_especie_idx" ON "Mascota"("especie");

-- CreateIndex
CREATE UNIQUE INDEX "HistoriaMedica_mascotaId_key" ON "HistoriaMedica"("mascotaId");

-- CreateIndex
CREATE INDEX "HistoriaMedica_mascotaId_idx" ON "HistoriaMedica"("mascotaId");

-- CreateIndex
CREATE INDEX "Cita_usuarioId_idx" ON "Cita"("usuarioId");

-- CreateIndex
CREATE INDEX "Cita_vetId_idx" ON "Cita"("vetId");

-- CreateIndex
CREATE INDEX "Cita_mascotaId_idx" ON "Cita"("mascotaId");

-- CreateIndex
CREATE INDEX "Cita_fecha_idx" ON "Cita"("fecha");

-- CreateIndex
CREATE INDEX "Cita_status_idx" ON "Cita"("status");

-- CreateIndex
CREATE INDEX "Calificacion_usuarioId_idx" ON "Calificacion"("usuarioId");

-- CreateIndex
CREATE INDEX "Calificacion_vetId_idx" ON "Calificacion"("vetId");

-- CreateIndex
CREATE UNIQUE INDEX "Calificacion_usuarioId_vetId_key" ON "Calificacion"("usuarioId", "vetId");

-- AddForeignKey
ALTER TABLE "Veterinario" ADD CONSTRAINT "Veterinario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VetClinica" ADD CONSTRAINT "VetClinica_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "Veterinario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VetClinica" ADD CONSTRAINT "VetClinica_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoriaMedica" ADD CONSTRAINT "HistoriaMedica_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "Veterinario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "Veterinario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

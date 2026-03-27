-- CreateEnum
CREATE TYPE "DeedSide" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('TRASLADO', 'DERECHO_REGISTRO', 'CERTIFICADO_CATASTRAL', 'CONSTANCIAS_ADEUDO', 'AVISO', 'REGISTRO_ESCRITURA', 'GASTO_NOTARIAL', 'PAGO_ISR', 'HONORARIOS');

-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('VENDEDOR', 'COMPRADOR', 'DONANTE', 'DONATARIO', 'HEREDERO', 'OTORGANTE', 'TESTADOR', 'PODERANTE', 'ASOCIADO');

-- CreateEnum
CREATE TYPE "DeedStatus" AS ENUM ('POR_LIQUIDAR', 'LIQUIDADO', 'PROCESO_PAGO', 'REGISTRO', 'PROCESO_ENTREGA', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'STATUS_CHANGE', 'DELETE', 'NOTE_CHANGE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "username" TEXT,
    "displayUsername" TEXT,
    "role" "UserRoles" NOT NULL DEFAULT 'user',
    "banned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deed" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "typeLabel" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "deedNumber" TEXT,
    "notes" TEXT,
    "baseValue" DECIMAL(12,2),
    "totalA" DECIMAL(12,2),
    "totalB" DECIMAL(12,2),
    "status" "DeedStatus" NOT NULL DEFAULT 'POR_LIQUIDAR',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deed_tax" (
    "id" TEXT NOT NULL,
    "deedId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "side" "DeedSide" DEFAULT 'A',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deed_tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participante" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "deedId" TEXT NOT NULL,
    "side" "DeedSide" NOT NULL DEFAULT 'A',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "deedId" TEXT,
    "action" "AuditAction" NOT NULL,
    "details" TEXT,
    "deedFolio" TEXT,
    "deedNumber" TEXT,
    "changes" JSONB,
    "deletedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" DECIMAL(12,6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "deed_userId_status_idx" ON "deed"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "deed_userId_folio_key" ON "deed"("userId", "folio");

-- CreateIndex
CREATE UNIQUE INDEX "deed_userId_deedNumber_key" ON "deed"("userId", "deedNumber");

-- CreateIndex
CREATE INDEX "deed_tax_deedId_idx" ON "deed_tax"("deedId");

-- CreateIndex
CREATE INDEX "deed_tax_deedId_side_idx" ON "deed_tax"("deedId", "side");

-- CreateIndex
CREATE UNIQUE INDEX "deed_tax_deedId_key_key" ON "deed_tax"("deedId", "key");

-- CreateIndex
CREATE INDEX "participante_deedId_side_idx" ON "participante"("deedId", "side");

-- CreateIndex
CREATE UNIQUE INDEX "participante_deedId_name_key" ON "participante"("deedId", "name");

-- CreateIndex
CREATE INDEX "audit_log_deedId_createdAt_idx" ON "audit_log"("deedId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_log_userId_createdAt_idx" ON "audit_log"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "taxes_key_idx" ON "taxes"("key");

-- CreateIndex
CREATE UNIQUE INDEX "taxes_key_name_key" ON "taxes"("key", "name");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deed" ADD CONSTRAINT "deed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deed_tax" ADD CONSTRAINT "deed_tax_deedId_fkey" FOREIGN KEY ("deedId") REFERENCES "deed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participante" ADD CONSTRAINT "participante_deedId_fkey" FOREIGN KEY ("deedId") REFERENCES "deed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_deedId_fkey" FOREIGN KEY ("deedId") REFERENCES "deed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

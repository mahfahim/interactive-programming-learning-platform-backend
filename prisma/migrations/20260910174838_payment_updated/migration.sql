-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "sslSessionKey" TEXT,
ADD COLUMN     "sslValId" TEXT,
ALTER COLUMN "paymentGateway" SET DEFAULT 'SSLCOMMERZ';

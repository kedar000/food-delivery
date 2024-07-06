-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('Veg', 'NonVeg');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT,
    "address" TEXT NOT NULL,
    "mobilenumber" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "restId" TEXT NOT NULL,
    "restname" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "ownername" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "mobilenumber" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("restId")
);

-- CreateTable
CREATE TABLE "DeliveryPartner" (
    "deliveryPartnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "mobilenumber" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DeliveryPartner_pkey" PRIMARY KEY ("deliveryPartnerId")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "restId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "refund" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "ItemsOrdered" (
    "itemId" TEXT NOT NULL,
    "itemname" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "refundId" TEXT,

    CONSTRAINT "ItemsOrdered_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Refund" (
    "refundId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "restId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("refundId")
);

-- CreateTable
CREATE TABLE "Menu" (
    "menuId" TEXT NOT NULL,
    "restId" TEXT NOT NULL,
    "itemname" TEXT NOT NULL,
    "description" TEXT,
    "type" "ItemType" NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("menuId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobilenumber_key" ON "User"("mobilenumber");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_mail_key" ON "Restaurant"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_mobilenumber_key" ON "Restaurant"("mobilenumber");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPartner_mail_key" ON "DeliveryPartner"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPartner_mobilenumber_key" ON "DeliveryPartner"("mobilenumber");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_restId_fkey" FOREIGN KEY ("restId") REFERENCES "Restaurant"("restId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "DeliveryPartner"("deliveryPartnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsOrdered" ADD CONSTRAINT "ItemsOrdered_refundId_fkey" FOREIGN KEY ("refundId") REFERENCES "Refund"("refundId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsOrdered" ADD CONSTRAINT "ItemsOrdered_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_restId_fkey" FOREIGN KEY ("restId") REFERENCES "Restaurant"("restId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restId_fkey" FOREIGN KEY ("restId") REFERENCES "Restaurant"("restId") ON DELETE RESTRICT ON UPDATE CASCADE;

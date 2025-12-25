-- CreateEnum
CREATE TYPE "LinkSection" AS ENUM ('HEADER_MAIN', 'FOOTER');

-- CreateTable
CREATE TABLE "StoreSetting" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "topBarEmail" TEXT NOT NULL DEFAULT 'mhhasanul@gmail.com',
    "topBarPhone" TEXT NOT NULL DEFAULT '(12345)67890',
    "allowLanguage" BOOLEAN NOT NULL DEFAULT true,
    "allowCurrency" BOOLEAN NOT NULL DEFAULT true,
    "logoText" TEXT NOT NULL DEFAULT 'Hekto',
    "footerAddress" TEXT NOT NULL DEFAULT '17 Princess Road, London, Greater London NW1 8JR, UK',
    "copyright" TEXT NOT NULL DEFAULT '©Webecy - All Rights Reserved',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkGroup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "section" "LinkSection" NOT NULL DEFAULT 'FOOTER',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LinkGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavLink" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NavLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageContent" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_slug_key" ON "PageContent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- AddForeignKey
ALTER TABLE "NavLink" ADD CONSTRAINT "NavLink_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "LinkGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

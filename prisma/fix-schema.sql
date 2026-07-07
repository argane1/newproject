DROP TABLE IF EXISTS "Link" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

CREATE TABLE "User" (
  "id" SERIAL NOT NULL,
  "email" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "clerkId" TEXT,
  "name" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId") WHERE clerkId IS NOT NULL;

CREATE TABLE "Link" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "userId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Link_title_key" ON "Link"("title");

ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- CreateTable
CREATE TABLE "LogisticChannel" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,

    CONSTRAINT "LogisticChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckOutLog" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "CheckOutLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CheckOutLog" ADD CONSTRAINT "CheckOutLog_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

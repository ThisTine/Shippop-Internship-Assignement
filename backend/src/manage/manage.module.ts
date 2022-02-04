import { Module } from '@nestjs/common';
import { ManageService } from './manage.service';
import { ManageController } from './manage.controller';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports:[PrismaModule],
  controllers: [ManageController],
  providers: [ManageService]
})
export class ManageModule {}

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { CheckUserMiddleware } from './checkuser.middleware';
import { ManageModule } from './manage/manage.module';
import { ManageController } from './manage/manage.controller';
@Module({
  imports: [AuthModule, PrismaModule, UserModule, ConfigModule.forRoot({isGlobal:true}), ItemModule, ManageModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes(UserController)
      // .apply(CheckUserMiddleware).forRoutes(ItemModule)
      .apply(LoggerMiddleware).forRoutes(ManageController)
  }
}

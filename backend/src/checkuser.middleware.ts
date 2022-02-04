import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { prisma, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { decode, verify } from 'jsonwebtoken';
import { UserRequest } from './logger.middleware';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class CheckUserMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService){}
  async use(req: UserRequest, res: Response, next: NextFunction) {
    console.log("Here")
    if(req.cookies['token']){
      try{
        console.log(req.cookies['token'])
        const playload = await verify(req.cookies['token'],process.env.SC) as {userid?:string}
        if(playload?.userid){
          console.log(playload)
          const user = await this.prisma.user.findFirst({where:{id:playload.userid}})
          if(user){
            delete user['pwd']
            req.user = user
            return next()
          }
        }
        throw new Error("Non id")
      }catch(err){
        return next()
      }
    }else{
      return next()
    }
  }
}

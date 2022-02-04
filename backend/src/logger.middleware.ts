import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { prisma, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { decode, verify } from 'jsonwebtoken';
import { PrismaService } from './prisma/prisma.service';

export interface UserRequest extends Request{
  user?:User
} 

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService){}
  async use(req: UserRequest, res: Response, next: NextFunction) {
    if(req.cookies['token']){
      try{
        const playload = await verify(req.cookies['token'],process.env.SC) as {userid?:string}
        if(playload?.userid){
          const user = await this.prisma.user.findFirst({where:{id:playload.userid}})
          if(user){
            delete user['pwd']
            req.user = user
            return next()
          }
        }
        throw new Error("Non id")
      }catch(err){
        throw new HttpException(typeof err === "string" ? err :"Invalid token",HttpStatus.BAD_REQUEST)
      }
    }else{
      throw new HttpException("Require login",HttpStatus.BAD_REQUEST)
    }
  }
}

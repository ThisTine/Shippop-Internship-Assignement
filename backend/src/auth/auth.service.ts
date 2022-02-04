import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAuthDto } from './dto/login-auth-dto';
import { RegisterAuthDto } from './dto/register-auth-dto';
import { hash, compare } from 'bcryptjs';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(login: LoginAuthDto, response: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: login.email },
        include: {
          location:true,
            whishlists:{select:{itemID:true}},
            cart:{select:{item:true,amount:true}},
            reviewes:{select:{itemID:true,rating:true}}
        },
      });
      if (!user) {
        throw new HttpException("There's no user", HttpStatus.BAD_REQUEST);
      }
      if (await compare(login.pwd, user.pwd)) {
        const jwt = sign({ userid: user.id }, process.env.SC, {
          expiresIn: '365d',
        });
        response.cookie('token', jwt, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        return { ...user, pwd: '' };
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      return new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async register(register: RegisterAuthDto, response: Response) {
    try {
      const finduserr = await this.prisma.user.findFirst({
        where: { email: register.email },
      });
      if (finduserr) {
        throw new HttpException(
          'User is already exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      const pwd = await hash(register.pwd, parseInt(process.env.SALT));
      const user = await this.prisma.user.create({
        data: { ...register, pwd: pwd },
      });
      const jwt = sign({ userid: user.id }, process.env.SC, {
        expiresIn: '365d',
      });
      response.cookie('token', jwt, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
      return { ...user, pwd: '' };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async logout(response: Response) {
    response.cookie('token', '', { maxAge: 0 });
    return { loggedout: true };
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth-dto';
import { RegisterAuthDto } from './dto/register-auth-dto';
import {Request, Response} from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() login: LoginAuthDto,@Res({passthrough:true}) response: Response ) {
    return this.authService.login(login,response);
  }

  @Post('register')
  register(@Body() register: RegisterAuthDto,@Res({passthrough:true}) response: Response){
    return this.authService.register(register,response)
  }

  @Post('logout')
  logout(@Res({passthrough:true}) res:Response){
    return this.authService.logout(res)
  }
}

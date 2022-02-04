import { IsEmail, IsNotEmpty } from "class-validator"

export class RegisterAuthDto{
    @IsEmail()
    email:string
    @IsNotEmpty()
    firstname:string
    @IsNotEmpty()
    lastname:string
    @IsNotEmpty()
    pwd:string
}
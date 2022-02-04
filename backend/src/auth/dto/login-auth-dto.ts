import { IsEmail, IsNotEmpty } from "class-validator"

export class LoginAuthDto {
    @IsEmail()
    email: string
    @IsNotEmpty()
    pwd: string
}
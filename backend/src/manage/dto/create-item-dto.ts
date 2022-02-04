import {IsNotEmpty, IsNumber, IsString, Min } from "class-validator"

export class CreateItemDto{
    @IsString()
    @IsNotEmpty()
    name:string
    @IsString()
    @IsNotEmpty()
    publisher: string
    @IsString()
    @IsNotEmpty()
    description:string
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    price:number
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    amount:number
    @IsString()
    @IsNotEmpty()
    categoryId: string
    @IsString()
    @IsNotEmpty()
    image:string
}
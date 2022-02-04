import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class UpdateItemDto{
    @IsNumber()
    @IsNotEmpty()
    price : number
    @IsNotEmpty()
    @IsString()
    itemID : string
    @IsNotEmpty()
    @IsString()
    name : string
    @IsNotEmpty()
    @IsString()
    description : string
}
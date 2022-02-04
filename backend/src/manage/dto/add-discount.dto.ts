import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class AddDiscountDto{
    @IsNumber()
    @IsNotEmpty()
    price : number
    @IsNotEmpty()
    @IsString()
    itemID : string
    @IsDateString()
    @IsNotEmpty()
    expire: Date
}
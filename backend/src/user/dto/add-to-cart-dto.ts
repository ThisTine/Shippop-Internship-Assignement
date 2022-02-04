import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class AddToCartDto{
    @IsNotEmpty()
    @IsString()
    itemId:string
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amount:number
}
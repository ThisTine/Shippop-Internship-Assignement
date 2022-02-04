import { IsNotEmpty, IsString } from "class-validator";

export class DeleteDiscountDto{
    @IsString()
    @IsNotEmpty()
    itemID:string
}
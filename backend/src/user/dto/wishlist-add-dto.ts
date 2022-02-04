import { IsNotEmpty, IsString } from "class-validator";

export class AddWishListDto{
    @IsNotEmpty()
    @IsString()
    itemId: string
}
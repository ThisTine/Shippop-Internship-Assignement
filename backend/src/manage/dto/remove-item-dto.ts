import { IsNotEmpty, IsString } from "class-validator";

export class RemoveItemDto {
    @IsNotEmpty()
    @IsString()
    itemId:string
}
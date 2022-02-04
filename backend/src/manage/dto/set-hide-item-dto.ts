import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class SetHideItemDto {
    @IsNotEmpty()
    @IsString()
    itemId:string
    @IsNotEmpty()
    @IsBoolean()
    ishide:boolean
}
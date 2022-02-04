import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class ReviewDto{
    @IsString()
    @IsNotEmpty()
    itemId: string
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(5)
    review: number
}
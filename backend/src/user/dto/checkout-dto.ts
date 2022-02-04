import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { LocationDto } from "./location-dto";

export class CheckOutDto{
    @IsNotEmpty()
    @IsString()
    logisticId: string
    @IsNotEmpty()
    @IsString()
    payment: string
    @IsObject()
    location: LocationDto
    @IsBoolean()
    updateLocation: boolean
}
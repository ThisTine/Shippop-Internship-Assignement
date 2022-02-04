import { IsNotEmpty, IsNumberString, IsString } from "class-validator"

export class LocationDto{
    @IsNotEmpty()
    @IsString()
    firstname: string
    @IsNotEmpty()
    @IsString()
    lastname: string
    @IsNotEmpty()
    @IsString()
    country: string
    @IsNotEmpty()
    @IsString()
    location: string
    @IsNotEmpty()
    @IsString()
    district: string
    @IsNotEmpty()
    @IsString()
    city: string
    @IsNotEmpty()
    @IsString()
    province: string
    @IsNotEmpty()
    @IsNumberString()
    zipcode: string
    @IsNotEmpty()
    @IsNumberString()
    phonenumber: string
}
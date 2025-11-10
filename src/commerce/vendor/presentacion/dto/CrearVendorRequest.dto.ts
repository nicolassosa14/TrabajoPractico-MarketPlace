import { IsString, IsNotEmpty, IsNumber, Max, IsEmail, IsBoolean } from "class-validator";

export class createVendorRequestDto {
    @IsString()
    @IsNotEmpty() 
    name: string;


    @IsString()
    @IsNotEmpty() 
    description: string;

    @IsString()
    @IsNotEmpty() 
    address: string;


    @IsBoolean()
    is_active: boolean;

    @IsString()
    @IsNotEmpty() 
    user_id: string;

    @IsString()
    @IsNotEmpty() 
    image_url: string;

}
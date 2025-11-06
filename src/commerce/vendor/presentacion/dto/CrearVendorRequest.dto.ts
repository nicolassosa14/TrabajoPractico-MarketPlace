import { IsString, IsNotEmpty, IsNumber, Max, IsEmail } from "class-validator";

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


    @IsNumber()
    @Max(1)
    is_active: boolean;

    @IsString()
    @IsNotEmpty() 
    user_id: string;
}
import { IsString, IsNotEmpty, IsNumber, Max, IsEmail } from "class-validator";

export class createVendorRequestDto {
    @IsString()
    @IsNotEmpty() 
    name: string;


    @IsEmail()
    @IsNotEmpty() 
    email: string;

    @IsString()
    @IsNotEmpty() 
    descripcion: string;

    @IsString()
    @IsNotEmpty() 
    address: string;

    @IsString()
    @IsNotEmpty() 
    password: string;

    @IsNumber()
    @Max(1)
    is_active: number;
}
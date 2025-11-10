import {
    IsEmail,
    IsNotEmpty,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';


export default class PutVendorRequestDTO{
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
    @IsString()
    @IsNotEmpty()
    descripcion: string;
    @IsString()
    @IsNotEmpty()
    address: string;
    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;

    @IsString()
    @IsNotEmpty()
    image_url: string;
}

export class PatchVendorRequestDTO{
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsBoolean()
    @IsNotEmpty()
    is_active?: boolean;

    
}
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsArray } from "class-validator";

export class CreateProductRequestDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    price: number;

    @IsString()
    @IsNotEmpty()
    image_url: string;

    @IsBoolean()
    @IsOptional()
    is_available?: boolean;

    @IsString()
    @IsNotEmpty()
    vendor_id: string;

    @IsString()
    @IsNotEmpty()
    category_ids: string;
}

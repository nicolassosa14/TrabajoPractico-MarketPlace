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

    @IsArray()
    @IsNotEmpty({ each: true })
    category_ids: number[];
}

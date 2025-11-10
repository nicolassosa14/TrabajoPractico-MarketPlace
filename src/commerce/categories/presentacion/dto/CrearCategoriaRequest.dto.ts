import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryRequestDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    image_url: string;

    @IsString()
    @IsNotEmpty() 
    user_id: string;
}

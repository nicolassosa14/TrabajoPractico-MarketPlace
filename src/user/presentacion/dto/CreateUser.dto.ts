import { IsString, IsNotEmpty, IsNumber, Max, IsEmail, IsDate } from "class-validator";

export default class CreateUserRequestDTO{
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsNumber()
    @IsNotEmpty()
    phone:number;
}
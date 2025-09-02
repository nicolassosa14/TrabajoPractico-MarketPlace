import { IsString, IsNotEmpty, IsNumber, Max, IsEmail, IsDate } from "class-validator";
export default class CreateUserDTO{
    id: string;
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsDate()
    @IsNotEmpty()
    createdAt: Date;
    
    isActive: boolean;
    @IsNumber()
    @IsNotEmpty()
    phone:number;
}
import { Get,Body, Controller, Delete, Param, Patch, Post, Req , BadRequestException, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
//DTO PRESENTACION
import CreateUserRequestDTO from './dto/CreateUser.dto';
import LoginUserRequestDTO from './dto/LoginUserRequest.dto';
//DTO SERVICE (COMMANDS)
import CreateUserCommand from '../service/DTO/CreateUser.dto';
import LoginUserCommand from '../service/DTO/LoginUser.dto';
import DeleteUserCommand from '../service/DTO/DeleteUser.dto';

import { PatchUserRequestDTO } from './dto/UpdateUser.dto';
import { PatchUserCommand } from '../service/DTO/UpdateUser.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserRequestDTO) {
    if(!dto.email){
        throw new BadRequestException('Falta el email');
    }
    if(!dto.password){
        throw new BadRequestException('Falta la contraseña');
    }
    if(!dto.first_name){
        throw new BadRequestException('Falta el nombre');
    }
    if(!dto.last_name){
        throw new BadRequestException('Falta el apellido');
    }
    
    const command = new CreateUserCommand(dto.email, dto.password, dto.first_name, dto.last_name);
    return this.userService.createUser(command);
  }
  @Post('/login')
  async LoginUser(@Body() dto: LoginUserRequestDTO){
    const command = new LoginUserCommand(dto.email, dto.password)
    return this.userService.loginUser(command)
  }
  @Post('/resend-email/:email')
  async resendVerificationEmail(@Param('email') email: string) {
    return this.userService.resendVerificationEmail(email)
  }

  @Get('/profile')
  async getUserProfile(@Body() user_id: string) {
    if (!user_id) {
        throw new BadRequestException('Se requiere el ID del usuario');
    }
    return this.userService.getUserProfile(user_id);
  }


  @Patch('/profile')
  async EditUserInfo(@Body() dto: PatchUserRequestDTO){

    if (!dto.user_id) {
        throw new BadRequestException('Se requiere el ID del usuario');
    }

    // objeto solo con los campos que se enviaron
    const updateData: Partial<PatchUserRequestDTO> = {};
    
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.first_name !== undefined) updateData.first_name = dto.first_name;
    if (dto.last_name !== undefined) updateData.last_name = dto.last_name;
    if (dto.phone_number !== undefined) updateData.phone_number = dto.phone_number;

    const command = new PatchUserCommand(
        dto.user_id,
        updateData.email,
        updateData.first_name,
        updateData.last_name,
        updateData.phone_number
    );

    return this.userService.EditUserInfo(command)
  }

}

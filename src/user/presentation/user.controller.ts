import {
  Get,
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
//DTO PRESENTACION
import CreateUserRequestDTO from './dto/CreateUser.dto';
import LoginUserRequestDTO from './dto/LoginUserRequest.dto';
//DTO SERVICE (COMMANDS)
import CreateUserCommand from '../service/dto/CreateUser.dto';
import LoginUserCommand from '../service/dto/LoginUser.dto';
import DeleteUserCommand from '../service/dto/DeleteUser.dto';

import { PatchUserRequestDTO } from './dto/UpdateUser.dto';
import { PatchUserCommand } from '../service/dto/UpdateUser.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUserRequest(@Body() dto: CreateUserRequestDTO) {
    const command = new CreateUserCommand(
      dto.email,
      dto.password,
      dto.first_name,
      dto.last_name,
    );
    return this.userService.createUser(command);
  }
  @Post('/login')
  async LoginUserRequest(@Body() dto: LoginUserRequestDTO) {
    const command = new LoginUserCommand(dto.email, dto.password);
    return this.userService.loginUser(command);
  }
  @Post('/resend-email/:email')
  async resendVerificationEmailRequest(@Param('email') email: string) {
    return this.userService.resendVerificationEmail(email);
  }
  @Get('/verification-status/:email')
  async VerificationStatusRequest(@Param('email') email: string) {
    return this.userService.VerificationStatus(email);
  }

  @Get('/profile/:user_id')
  async getUserProfileRequest(@Param('user_id') user_id: string) {
    return this.userService.getUserProfile(user_id);
  }

  @Patch('/profile')
  async EditUserInfoRequest(@Body() dto: PatchUserRequestDTO) {
    // objeto solo con los campos que se enviaron
    const updateData: Partial<PatchUserRequestDTO> = {};

    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.first_name !== undefined) updateData.first_name = dto.first_name;
    if (dto.last_name !== undefined) updateData.last_name = dto.last_name;
    if (dto.phone_number !== undefined)
      updateData.phone_number = dto.phone_number;

    const command = new PatchUserCommand(
      dto.user_id,
      updateData.email,
      updateData.first_name,
      updateData.last_name,
      updateData.phone_number,
    );

    return this.userService.EditUserInfo(command);
  }

  @Get('/profile-with-addresses/:user_id')
  async getUserProfileWithAddresses(@Param('user_id') user_id: string) {
    return this.userService.getUserWithAddresses(user_id);
  }
}

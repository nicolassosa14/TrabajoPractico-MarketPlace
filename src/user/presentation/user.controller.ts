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

  @Get('/profile/:user_id')
  async getUserProfileRequest(@Param('user_id') user_id: string) {
    if (!user_id) {
      throw new BadRequestException('Se requiere el ID del usuario');
    }
    return this.userService.getUserProfile(user_id);
  }

  @Patch('/profile')
  async EditUserInfoRequest(@Body() dto: PatchUserRequestDTO) {
    if (!dto.user_id) {
      throw new BadRequestException('Se requiere el ID del usuario');
    }

    const command = new PatchUserCommand(
      dto.user_id,
      dto.first_name,
      dto.last_name,
      dto.email,
      dto.phone_number,
    );

    return this.userService.EditUserInfo(command);
  }

  @Get('/profile-with-addresses/:user_id')
  async getUserProfileWithAddresses(@Param('user_id') user_id: string) {
    return this.userService.getUserWithAddresses(user_id);
  }

  @Post('/favorite-vendors/:user_id/:vendor_id')
  async addFavoriteVendorRequest(
    @Param('user_id') user_id: string,
    @Param('vendor_id') vendor_id: string,
  ) {
    return this.userService.addFavoriteVendor(user_id, vendor_id);
  }

  @Delete('/favorite-vendors/:user_id/:vendor_id')
  async removeFavoriteVendorRequest(
    @Param('user_id') user_id: string,
    @Param('vendor_id') vendor_id: string,
  ) {
    return this.userService.removeFavoriteVendor(user_id, vendor_id);
  }

  @Get('/favorite-vendors/:user_id')
  async getUserFavoriteVendors(@Param('user_id') user_id: string) {
    return this.userService.getUserFavoriteVendors(user_id);
  }
}

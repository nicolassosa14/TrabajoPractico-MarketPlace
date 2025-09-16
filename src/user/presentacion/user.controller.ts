import {Controller,Delete,Get,Param, Patch,Post,Put,Body} from '@nestjs/common';
import { UserService } from '../service/user.service';
import CreateUserRequestDTO from './dto/CreateUser.dto';
import CreateUserCommand from '../service/DTO/CreateUser.dto';
import DeleteUserCommand from '../service/DTO/DeleteUser.dto';
@Controller()
export class UserController {
  userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post()
  async create(@Body() CreateUserRequestDTO: CreateUserRequestDTO) {
    const command = new CreateUserCommand(
      CreateUserRequestDTO.name,
      CreateUserRequestDTO.email,
      CreateUserRequestDTO.phone,
    );

    return this.userService.createUser(command);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.deleteUser(new DeleteUserCommand(id));
  }
}

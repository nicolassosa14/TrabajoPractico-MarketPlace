import { Get,Body, Controller, Delete, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from '../service/user.service';
import CreateUserRequestDTO from './dto/CreateUser.dto';
import CreateUserCommand from '../service/DTO/CreateUser.dto';
import DeleteUserCommand from '../service/DTO/DeleteUser.dto';
import UpdatePutUserCommand from '../service/DTO/UpdateUser.dto';
import UpdatePatchUserCommand from '../service/DTO/UpdateUser.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserRequestDTO) {
    const command = new CreateUserCommand(dto.email, dto.password);
    return this.userService.createUser(command);
  }

  @Get()
  async TestMessage(){
    return 'Soy Un test'
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.deleteUser(new DeleteUserCommand(id));
  }

}

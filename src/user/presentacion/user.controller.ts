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
    const command = new CreateUserCommand(dto.name, dto.email, dto.phone);
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

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() dto: any) {
    const command = new UpdatePutUserCommand(id, dto.name, dto.email, dto.phone);
    return this.userService.UpdateUser(command);
  }

  @Patch(':id')
  async patchUser(@Param('id') id: number, @Body() dto: any) {
    const command = new UpdatePatchUserCommand(id, dto.name, dto.email, dto.phone);
    return this.userService.patchUser(command);
  }
}

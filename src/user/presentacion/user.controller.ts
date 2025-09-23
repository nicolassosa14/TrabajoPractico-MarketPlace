import { Get,Body, Controller, Delete, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from '../service/user.service';
//DTO PRESENTACION
import CreateUserRequestDTO from './dto/CreateUser.dto';
import LoginUserRequestDTO from './dto/LoginUserRequest.dto';
//DTO SERVICE (COMMANDS)
import CreateUserCommand from '../service/DTO/CreateUser.dto';
import LoginUserCommand from '../service/DTO/LoginUser.dto';
import DeleteUserCommand from '../service/DTO/DeleteUser.dto';


@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserRequestDTO) {
    const command = new CreateUserCommand(dto.email, dto.password);
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

  @Get()
  async TestMessage(){
    return 'Soy Un test'
  }

}

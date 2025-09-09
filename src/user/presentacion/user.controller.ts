import { Controller, Delete, Get, Param, Patch, Post, Put, Body } from '@nestjs/common';
import { UserService } from '../service/user.service';
import CreateUserRequestDTO from './dto/CreateUser.dto';


@Controller()
export class UserController{
    userService: UserService;
    constructor(userService:UserService) {
        this.userService = userService;
    }

    @Post()
    async create (@Body() CreateUserRequestDTO: CreateUserRequestDTO){
        return this.userService.createUser(CreateUserRequestDTO);
    }
    
}
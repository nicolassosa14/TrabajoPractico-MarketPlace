import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/contract/user.repository';
import CreateUserCommand from './DTO/CreateUser.dto';
import User from '../domain/modelos/user';

import DeleteUserCommand from './DTO/DeleteUser.dto';
import LoginUserCommand from './DTO/LoginUser.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {} 

  async createUser(dto: CreateUserCommand) { 
    const user = new User(
      dto.getEmail(),
      dto.getPassword(),
    );

    return this.userRepository.createUser(user)
  }
  
  async loginUser(dto: LoginUserCommand){
    const user = new User(
      dto.getEmail(),
      dto.getPassword(),
    )
    return this.userRepository.loginUser(user)
  }

  async resendVerificationEmail(email:string){
    return this.userRepository.resendVerificationEmail(email)
  }

}

import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/contract/user.repository';
import CreateUserCommand from './DTO/CreateUser.dto';
import User from '../domain/modelos/user';
import { v4 } from 'uuid';
import DeleteUserCommand from './DTO/DeleteUser.dto';
import UpdatePutUserCommand from './DTO/UpdateUser.dto';
import UpdatePatchUserCommand from './DTO/UpdateUser.dto';
import { SupabaseUserRepository } from '../infrastructure/repositories/supabase.user.repository';
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

  async deleteUser(dto: DeleteUserCommand) {
    const id = dto.getId();
    if(id){
        return this.userRepository.delete(id);
    }
    throw new Error('You must provide an id to delete a user.');
  }

}

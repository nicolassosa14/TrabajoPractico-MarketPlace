import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/contract/user.repository';
import CreateUserCommand from './DTO/CreateUser.dto';
import User from '../domain/modelos/user';
import { v4 } from 'uuid';
import DeleteUserCommand from './DTO/DeleteUser.dto';
import UpdatePutUserCommand from './DTO/UpdateUser.dto';
import UpdatePatchUserCommand from './DTO/UpdateUser.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async createUser(dto: CreateUserCommand) {
    const user = new User(
      dto.getName(),
      dto.getEmail(),
      dto.getPhone(),
      undefined,
      v4(),
    );

    return this.userRepository.save(user);
  }

  async deleteUser(dto: DeleteUserCommand) {
    const id = dto.getId();
    if(id){
        return this.userRepository.delete(id);
    }
    throw new Error('You must provide an id to delete a user.');
  }

  async UpdateUser(dto: UpdatePutUserCommand) {
    const user = new User(
      dto.getName(),
      dto.getEmail(),
      dto.getPhone(),
      dto.getId(),
      undefined,
    );
    return this.userRepository.updateUser(user);
  }

  async patchUser(dto: UpdatePatchUserCommand) {
    const existingUser = await this.userRepository.findById(dto.getId());
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser = new User(
      dto.getName() ?? existingUser.getName(),
      dto.getEmail() ?? existingUser.getEmail(),
      dto.getPhone() ?? existingUser.getPhone(),
      existingUser.getId(),
      existingUser.getUuid(),
    );

    return this.userRepository.updateUser(updatedUser);
  }
}

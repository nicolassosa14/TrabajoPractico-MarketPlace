import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { UserRepository } from '../domain/contract/user.repository';
import CreateUserCommand from './DTO/CreateUser.dto';
import User from '../domain/modelos/user';

import DeleteUserCommand from './DTO/DeleteUser.dto';
import LoginUserCommand from './DTO/LoginUser.dto';
import { PatchUserRequestDTO } from '../presentacion/dto/UpdateUser.dto';
import { PatchUserCommand } from './DTO/UpdateUser.dto';
@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async createUser(dto: CreateUserCommand) {

    if (!dto.getEmail() || !dto.getPassword() || !dto.getFirst_Name() || !dto.getLast_Name()) {
      throw new BadRequestException('Falta algun dato (email, contraseña, nombre o apellido).');
    }
    const user = new User(
      dto.getEmail(),
      dto.getPassword(),
      dto.getFirst_Name(),
      dto.getLast_Name()
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

  async getUserProfile(user_id: string) {
    if (!user_id) {
        throw new BadRequestException('Se requiere el ID del usuario');
    }
    return this.userRepository.getUserProfile(user_id);
  }

  async EditUserInfo(command: PatchUserCommand){
       try {

        type PartialUserUpdate = {
            email?: string;
            first_name?: string;
            last_name?: string;
            phone_number?: number;
        };

        const updateData: PartialUserUpdate = {};
        
        if (command.getEmail()) updateData.email = command.getEmail();
        if (command.getfirst_name()) updateData.first_name = command.getfirst_name();
        if (command.getlast_name()) updateData.last_name = command.getlast_name();
        if (command.getPhone()) updateData.phone_number = command.getPhone();

        const updatedUser = await this.userRepository.updatePartialProfile(
            command.getId(),
            updateData
        );

        return updatedUser;
    } catch (error) {
        throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
  }

}

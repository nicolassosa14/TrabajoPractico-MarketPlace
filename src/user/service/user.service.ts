import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/contract/user.repository';
import { CreateUserDTO } from '../presentacion/dto/CreateUser.dto';


@Injectable()
export class UserService {
    constructor(
            @Inject('UserRepository') private readonly userRepository: UserRepository
    ){}

    async createUser(dto: CreateUserDTO) {
        return this.userRepository.createUser(dto);
    }

}
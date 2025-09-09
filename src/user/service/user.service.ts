import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/contract/user.repository';
import CreateUserCommand from './DTO/CreateUser.dto';
import User from '../domain/modelos/user';
import { v4 } from 'uuid';


@Injectable()
export class UserService {
    constructor(
            @Inject('UserRepository') private readonly userRepository: UserRepository
    ){}

    async createUser(dto: CreateUserCommand) {
        const user = new User(
            dto.getName(), dto.getEmail(), dto.getPhone(), undefined, v4())

        return this.userRepository.save(user);
    }

}
import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/contract/user.repository';
import CreateUserCommand from './DTO/CreateUser.dto';


@Injectable()
export class UserService {
    constructor(
            @Inject('UserRepository') private readonly userRepository: UserRepository
    ){}

    async createUser(dto: CreateUserCommand) {
        return this.userRepository.createUser(dto);
    }

}
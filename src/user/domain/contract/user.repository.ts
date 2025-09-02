import { CreateUserDTO } from '../../presentacion/dto/CreateUser.dto';

export interface UserRepository {
createUser(data: CreateUserDTO): Promise<any>;

}
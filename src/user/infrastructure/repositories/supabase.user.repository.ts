import { UserRepository } from "src/user/domain/contract/user.repository";
import {Inject , Injectable} from '@nestjs/common';
import CreateUserDTO from '../../presentacion/dto/CreateUser.dto';

@Injectable()
export class SupabaseUserRepository implements UserRepository {
constructor(@Inject('SUPABASE_CLIENT') private readonly supabaseClient) {
}
    createUser(data: CreateUserDTO): Promise<any> {
        throw new Error("Method not implemented.");
    }

async CreateUser(data: CreateUserDTO): Promise<any> {
    const { data: result, error} = await this.supabaseClient
                        .from('users')
                        .insert([data])

    if(error){
        throw new Error(error.message)
    }
    return result
}
}
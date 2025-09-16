import { UserRepository } from 'src/user/domain/contract/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import CreateUserDTO from '../../presentacion/dto/CreateUser.dto';
import DeleteUserDTO from '../../presentacion/dto/DeleteUser.dto';
import DeleteUserCommand from 'src/user/service/DTO/DeleteUser.dto';
@Injectable()
export class SupabaseUserRepository implements UserRepository {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabaseClient) {}
  createUser(data: CreateUserDTO): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async CreateUser(data: CreateUserDTO): Promise<any> {
    const { data: result, error } = await this.supabaseClient
      .from('users')
      .insert([data])

    const message = 'Usuario no creado';
    if (error) {
      throw new Error(message + error);
    }
    return result;
  }

  
  async DeleteUser (data: DeleteUserCommand): Promise<any> {
    const { data: result, error } = await this.supabaseClient
      .from('users')
      .delete()
      .eq('id', data.getId() || -1);

    const message = 'Usuario no eliminado';
    if (error) {
      throw new Error(message + error);
    }
    return result;
  }

}

import { UserRepository } from 'src/user/domain/contract/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import User from '../../domain/modelos/user';


import CreateUserCommand from 'src/user/service/DTO/CreateUser.dto';
import DeleteUserCommand from 'src/user/service/DTO/DeleteUser.dto';
import UpdatePutUserCommand from 'src/user/service/DTO/UpdateUser.dto';
import UpdatePatchUserCommand from 'src/user/service/DTO/UpdateUser.dto';

@Injectable()
export class SupabaseUserRepository implements UserRepository {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient) {}


  async createUser(command: CreateUserCommand): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .insert([
        {
          name: command.getName(),
          email: command.getEmail(),
          phone: command.getPhone(),
        },
      ])
      .select();

    if (error) {
      throw new Error('Usuario no creado: ' + error.message);
    }
    return data;
  }

 
  async deleteUser(command: DeleteUserCommand): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .delete()
      .eq('id', command.getId());

    if (error) {
      throw new Error('Usuario no eliminado: ' + error.message);
    }
    return data;
  }

  async update(command: UpdatePutUserCommand): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .update({
        name: command.getName(),
        email: command.getEmail(),
        phone: command.getPhone(),
      })
      .eq('id', command.getId())
      .select();

    if (error) {
      throw new Error('Usuario no actualizado: ' + error.message);
    }
    return data;
  }

 
  async patchUser(command: UpdatePatchUserCommand): Promise<any> {
    const updateData: any = {};
    if (command.getName()) updateData.name = command.getName();
    if (command.getEmail()) updateData.email = command.getEmail();
    if (command.getPhone()) updateData.phone = command.getPhone();

    const { data, error } = await this.supabaseClient
      .from('users')
      .update(updateData)
      .eq('id', command.getId())
      .select();

    if (error) {
      throw new Error('Usuario no actualizado (PATCH): ' + error.message);
    }
    return data;
  }


  async findById(id: number): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error('Usuario no encontrado: ' + error.message);
    }
    return data;
  }

  save(user: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

async delete(id: number): Promise<any> {
        const { data, error } = await this.supabaseClient
            .from('users')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return data;
    }

    async updateUser(user: User): Promise<User> {
        const { data, error } = await this.supabaseClient
            .from('users')
            .update(user)
            .eq('id', user.getId())
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    async updatePartial(user: User): Promise<any> {
        const { data, error } = await this.supabaseClient
            .from('users')
            .update(user)
            .eq('id', user.getId())
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
}

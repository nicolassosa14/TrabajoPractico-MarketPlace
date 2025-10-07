import { UserRepository } from 'src/user/domain/contract/user.repository';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import User from '../../domain/modelos/user';

//eliminar
import DeleteUserCommand from 'src/user/service/DTO/DeleteUser.dto';
import UpdatePutUserCommand from 'src/user/service/DTO/UpdateUser.dto';
import UpdatePatchUserCommand from 'src/user/service/DTO/UpdateUser.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { exec } from 'node:child_process';
import { profile } from 'node:console';
//
@Injectable()
export class SupabaseUserRepository implements UserRepository {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient) {}


  async createUser(user: User): Promise<any> {
    let { data, error } = await this.supabaseClient.auth.signUp({
      email: user.getEmail(),
      password: user.getPassword()
    })

    if (error) {
      throw new Error('Usuario no creado: ' + error.message);
    }
    let newuuid = data.user?.id

    if(!newuuid){
      throw new Error('El perfil no se pudo crear');
    }
    
    await this.createProfile(user, newuuid)

    return data;
  }

  async createProfile(user: User, id){
    const { error: profileError } = await this.supabaseClient.from('user_profiles').insert({
        user_id: id,
        first_name: user.getFirst_Name(),
        last_name: user.getLast_Name(),
        role: 'customer'
      });
      if (profileError){
          throw new Error('Error al crear perfil: ' + profileError.message);
      }
      else {
        return true;
      }
  }

  async EditUserProfile(id: number, user: User): Promise<any> {
    
  }

  async resendVerificationEmail(email: string): Promise<any>{
    let { data, error } = await this.supabaseClient.auth.resend({
      type: 'signup',
      email: email
    })

    if(error){
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }

    return data;
  }

  async loginUser(user: User): Promise<any> {
    let {data,error} = await this.supabaseClient.auth.signInWithPassword({
      email: user.getEmail(),
      password: user.getPassword()
    })

    if(error){
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
    return data;
  }
 
  async deleteUser(user: User): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .delete()
      .eq('id', user.getId());

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
        phone_number: command.getPhone(),
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
    if (command.getPhone()) updateData.phone_number = command.getPhone();

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

  async updatePartial(id: string, partialUser: Partial<{
        email?: string;
        first_name?: string;
        last_name?: string;
        phone_number?: number;
    }>): Promise<any> {
        try {
            const { data: existingUser, error: searchError } = await this.supabaseClient
            .from('user_profiles')
            .select('*')
            .eq('user_id', id)
            .single();

            if (searchError || !existingUser) {
                throw new Error(`Usuario no encontrado con ID: ${id}`);
            }
            const { data, error } = await this.supabaseClient
                .from('user_profiles')
                .update(partialUser)
                .eq('user_id', id)
                .select()
                .single();

            if (error) {
                throw new Error(`Error actualizando usuario: ${error.message}`);
            }

            return data;
        } catch (error) {
            throw new Error(`Error en updatePartial: ${error.message}`);
        }
    }


  async findById(id: number): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error('Usuario no encontrado: ' + error.message);
    }
    return data;
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
}

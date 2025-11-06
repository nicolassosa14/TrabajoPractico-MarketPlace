import { UserRepository } from 'src/user/domain/contract/user.repository';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import User from '../../domain/models/user';

//eliminar
import DeleteUserCommand from 'src/user/service/dto/DeleteUser.dto';
import UpdatePutUserCommand from 'src/user/service/dto/UpdateUser.dto';
import UpdatePatchUserCommand from 'src/user/service/dto/UpdateUser.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { exec } from 'node:child_process';
import { profile } from 'node:console';
//
@Injectable()
export class SupabaseUserRepository implements UserRepository {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient,
  ) {}

  async createUser(user: User): Promise<any> {
    const { data, error } = await this.supabaseClient.auth.signUp({
      email: user.getEmail(),
      password: user.getPassword(),
    });

    if (error) {
      throw new Error('Usuario no creado: ' + error.message);
    }
    const newuuid = data.user?.id;

    if (!newuuid) {
      throw new Error('El perfil no se pudo crear');
    }

    await this.createProfile(user, newuuid);

    return data;
  }

  async createProfile(user: User, id: string) {
    const { error: profileError } = await this.supabaseClient
      .from('user_profiles')
      .insert({
        user_id: id,
        first_name: user.getFirst_Name(),
        last_name: user.getLast_Name(),
        role: 'customer',
        email: user.getEmail(),
      });
    if (profileError) {
      throw new Error('Error al crear perfil: ' + profileError.message);
    } else {
      return true;
    }
  }

  async EditUserProfile(id: number, user: User): Promise<any> {}

  async getUserProfile(user_id: string): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error) {
      throw new Error('Perfil no encontrado: ' + error.message);
    }
    return data;
  }

  async resendVerificationEmail(email: string): Promise<any> {
    const { data, error } = await this.supabaseClient.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }

    return data;
  }
  //ver como implementar bien
  async VerificationStatus(email: string): Promise<any> {
    const { data, error } = await this.supabaseClient.auth.getUser();
    if (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
    return data;
  }

  async loginUser(user: User): Promise<any> {
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email: user.getEmail(),
      password: user.getPassword(),
    });

    if (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
    return data;
  }

  //VER
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

  //POR EL MOMENTO NO SE USA
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

  async updatePartialProfile(
    id: string,
    partialUser: Partial<{
      email?: string;
      first_name?: string;
      last_name?: string;
      phone_number?: string;
    }>,
  ): Promise<any> {
    console.log(
      'updatePartialProfile called with id:',
      id,
      'and partialUser:',
      partialUser,
    );
    try {
      const { data: existingUser, error: searchError } =
        await this.supabaseClient
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

  //terminar
  async delete(user_id: string): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('users')
      .delete()
      .eq('id', user_id);

    if (error) throw error;
    return data;
  }
  //no creo que se use
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
  //NO SE SI VAN TODAVIA, O SON DE OTRO MODULO
  async addFavoriteVendor(user_id: string, vendor_id: string) {
    const { data, error } = await this.supabaseClient
      .from('user_favorite_vendors')
      .insert({ user_id, vendor_id });
    if (error) throw error;
    return data;
  }
  async removeFavoriteVendor(user_id: string, vendor_id: string) {
    const { data, error } = await this.supabaseClient
      .from('user_favorite_vendors')
      .delete()
      .eq('user_id', user_id)
      .eq('vendor_id', vendor_id);
    if (error) throw error;
    return data;
  }
  //

  async addAdresss(
    user_id: string,
    street_address: string,
    city: string,
    postal_code: string,
    details: string,
  ) {
    const { data, error } = await this.supabaseClient
      .from('addresses')
      .insert({ user_id, street_address, city, postal_code, details });
    if (error) throw error;
    return data;
  }
}

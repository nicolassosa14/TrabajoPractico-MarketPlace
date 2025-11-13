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

  async EditUserProfile(id: number, user: User): Promise<any> {
    // Este método está sin implementar.
  }

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
    const { data: existingUser, error: searchError } = await this.supabaseClient
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', id)
      .single();

    if (searchError || !existingUser) {
      throw new BadRequestException(`Error en updatePartial: Usuario no encontrado con ID: ${id}`);
    }
    const { data, error } = await this.supabaseClient
      .from('user_profiles')
      .update(partialUser)
      .eq('user_id', id)
      .select()
      .single();
    if (error) {
      throw new BadRequestException(`Error en updatePartial: Error actualizando usuario: ${error.message}`);
    }
    return data;
  }

  async findById(id: number): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new BadRequestException('Usuario no encontrado: ' + error.message);
    }
    return data;
  }

  private async checkFavoriteVendor(user_id: string, vendor_id: string): Promise<boolean> {
    const { data: verify, error: errorVerify } = await this.supabaseClient
      .from('user_favorite_vendors')
      .select('*')
      .eq('user_id', user_id)
      .eq('vendor_id', vendor_id);

    if (errorVerify) {
      throw new BadRequestException('Error al verificar favorito: ' + errorVerify.message);
    }

    return verify && verify.length > 0;
  }

  async addFavoriteVendor(user_id: string, vendor_id: string) {
    const isFavorite = await this.checkFavoriteVendor(user_id, vendor_id);

    if (isFavorite) {
      throw new BadRequestException('Este vendedor ya está en tus favoritos');
    }

    const { data, error } = await this.supabaseClient
      .from('user_favorite_vendors')
      .insert({ user_id, vendor_id });

    if (error) {
      throw new BadRequestException('No se pudo agregar el vendedor a favoritos: ' + error.message);
    }

    return 'Vendedor agregado a favoritos';
  }

  async removeFavoriteVendor(user_id: string, vendor_id: string) {
    const isFavorite = await this.checkFavoriteVendor(user_id, vendor_id);

    if (!isFavorite) {
      throw new BadRequestException('Este vendedor no está en tus favoritos');
    }

    const { error } = await this.supabaseClient
      .from('user_favorite_vendors')
      .delete()
      .eq('user_id', user_id)
      .eq('vendor_id', vendor_id);

    if (error) {
      throw new BadRequestException('Error al eliminar el vendedor de favoritos: ' + error.message);
    }

    return 'Vendedor eliminado de favoritos';
  }

  async getFavoriteVendorsByUserID(user_id: string): Promise<any[]> {
    const { data, error } = await this.supabaseClient
      .from('user_favorite_vendors')
      .select('vendor_id')
      .eq('user_id', user_id);
    if (error) {
        throw new BadRequestException('No se pudo obtener la lista de vendedores favoritos: ' + error.message);
    }

    if (!data || data.length === 0) {
        return [];
    }
    
    const vendorIds = data.map((item) => item.vendor_id);
    const { data: vendorinfo, error: vendorError } = await this.supabaseClient
      .from('vendors')
      .select('*')
      .in('id', vendorIds);
    if (vendorError) {
        throw new BadRequestException('No se pudo obtener la información de los vendedores favoritos: ' + vendorError.message);
    }

    return vendorinfo;
  }
}

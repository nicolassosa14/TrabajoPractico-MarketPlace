import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import Admin from '../../domain/model/admin';
import type { AdminRepository } from '../../domain/contract/admin.repository';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAdminRepository implements AdminRepository {

  constructor(@Inject('SUPABASE_CLIENT') private readonly supabaseAdmin: SupabaseClient) 
  {
    
  }

  async createUser(admin: Admin) {
    if (!['vendor', 'driver'].includes(admin.getRole())) {
      throw new HttpException(
        `Rol "${admin.getRole()}" no permitido`,
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const { data, error } = await this.supabaseAdmin.auth.admin.createUser({
        email: admin.getEmail(),
        password: admin.getPassword(),
        user_metadata: { role: admin.getRole() },
        email_confirm: true,
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new HttpException(`Error al crear usuario: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByRole(role: string) {
    if (role !== 'vendor' && role !== 'driver' && role !== 'customer' && role !== 'all-users') {
      throw new HttpException(`Rol "${role}" no permitido`, HttpStatus.BAD_REQUEST);
    }

    try {
      const { data, error } = await this.supabaseAdmin.from('user_profiles').select('user_id, email, role');
      if (error) throw error;
      if (role !== 'all-users') {
        return data.filter((user: any) => user.role === role);
      }
      return data.filter((user: any) => user.role);
    } catch (error: any) {
      throw new HttpException(`Error al obtener usuarios: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(admin: Admin) {
  const id = admin.getId();
  if (!id) {
    throw new HttpException('El usuario debe tener un ID', HttpStatus.BAD_REQUEST);
  }

  try {
    const updateData: any = {
      email: admin.getEmail(),
      user_metadata: { role: admin.getRole() },
    };

    if (admin.getPassword()) {
      updateData.password = admin.getPassword();
    }

    const { data, error } = await this.supabaseAdmin.auth.admin.updateUserById(id, updateData);

    if (error) throw error;
    return data;
  } catch (error: any) {
    throw new HttpException(`Error al actualizar usuario: ${error.message}`, HttpStatus.BAD_REQUEST);
  }
}


  async deleteUser(id: string) {
    if (!id) {
      throw new HttpException('ID del usuario requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      const { data, error } = await this.supabaseAdmin.auth.admin.deleteUser(id);
      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new HttpException(`Error al eliminar usuario: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }
}

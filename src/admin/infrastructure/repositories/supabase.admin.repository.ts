// src/admin/infrastructure/repositories/supabase.admin.repository.ts
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import Admin from '../../domain/model/admin';
import type { AdminRepository } from '../../domain/contract/admin.repository';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAdminRepository implements AdminRepository {
  private supabaseAdmin;

  constructor(@Inject('SUPABASE_CLIENT') private readonly supabaseClient: any) {
    const supabaseUrl = 'https://nxilakpwsjqgerrviayg.supabase.co';
    const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aWxha3B3c2pxZ2VycnZpYXlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTc5ODYyMSwiZXhwIjoyMDc1Mzc0NjIxfQ.TW9vsdTCazKHZbucQQik7bOzRPUK1utEm2cmtyJvS5g'; // <- usa tu Service Role Key
    this.supabaseAdmin = createClient(supabaseUrl, serviceKey);
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
      throw new HttpException(
        `Error al crear usuario: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findAllByRole(role: string) {
    if (!['vendor', 'driver'].includes(role)) {
      throw new HttpException(
        `Rol "${role}" no permitido`,
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const { data, error } = await this.supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;

      return data.users.filter((u) => u.user_metadata?.role === role);
    } catch (error: any) {
      throw new HttpException(
        `Error al obtener usuarios: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async updateUser(admin: Admin) {
    if (!admin.getId()) {
      throw new HttpException('El usuario debe tener un ID', HttpStatus.BAD_REQUEST);
    }

    if (!['vendor', 'driver'].includes(admin.getRole())) {
      throw new HttpException(
        `Rol "${admin.getRole()}" no permitido`,
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const { data, error } = await this.supabaseAdmin.auth.admin.updateUserById(
        admin.getId(),
        {
          email: admin.getEmail(),
          user_metadata: { role: admin.getRole() },
        }
      );

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new HttpException(
        `Error al actualizar usuario: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
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
      throw new HttpException(
        `Error al eliminar usuario: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}

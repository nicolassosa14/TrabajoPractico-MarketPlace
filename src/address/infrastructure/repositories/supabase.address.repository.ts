import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { AddressRepository } from 'src/address/domain/contract/address.repository';
import Address from '../../domain/models/address';


@Injectable()
export class SupabaseAddressRepository implements AddressRepository {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient) {}


  // async createUser(user: User): Promise<any> {
  //   let { data, error } = await this.supabaseClient.auth.signUp({
  //     email: user.getEmail(),
  //     password: user.getPassword()
  //   })

  //   if (error) {
  //     throw new Error('Usuario no creado: ' + error.message);
  //   }
  //   let newuuid = data.user?.id

  //   if(!newuuid){
  //     throw new Error('El perfil no se pudo crear');
  //   }
    
  //   await this.createProfile(user, newuuid)

  //   return data;
  // }

    async createAddress(address : Address) {
        const { data, error } = await this.supabaseClient
            .from('addresses')
            .insert({ address });
        if (error) throw error;
        return data;
    }

    async findAllAddresssByUserID(): Promise<Address[]> {
        const { data, error } = await this.supabaseClient
            .from('addresses')
            .select('*');
        if (error) throw new BadRequestException('Error al obtener las direcciones: ' + error.message);
        return data as Address[];
    }

    async EditAdressByID(id: string, street_address: string, city: string, postal_code: string, details: string) {
        const { data, error } = await this.supabaseClient
            .from('addresses')
            .update({ street_address, city, postal_code, details })
            .eq('id', id);
        if (error) throw new BadRequestException('Error al editar la direccion: ' + error.message);
        return data;
    }
}

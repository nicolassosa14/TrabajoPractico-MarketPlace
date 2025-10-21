import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { AddressRepository } from 'src/address/domain/contract/address.repository';
import Address from '../../domain/models/address';


@Injectable()
export class SupabaseAddressRepository implements AddressRepository {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient) {}

    async createAddress(address : Address) {

        const { data:info, error:errorsearch } = await this.supabaseClient.from('addresses')
            .select('*')
            .eq('user_id', address.getUser_id())
            .eq('street_address', address.getStreet_address());

            if (info && info.length > 0) {
                throw new BadRequestException('Ya existe esta direccion para este usuario');
            }


        const { data, error } = await this.supabaseClient
            .from('addresses')
            .insert({ user_id: address.getUser_id(), street_address: address.getStreet_address(), city: address.getCity(), postal_code: address.getPostal_code(), details: address?.getDetails() });
        if (error) throw error;
        return "Dirección creada con éxito " + data;
    }

    async findAllAddressByUserID(user_id:string): Promise<Address[]> {
        const { data, error } = await this.supabaseClient
            .from('addresses')
            .select('*')
            .eq('user_id', user_id);
        if (error) throw new BadRequestException('Error al obtener las direcciones: ' + error.message);
        return data as Address[];
    }

    async EditAdressByID(id: string, address: Address): Promise<any> {
        const { data, error } = await this.supabaseClient
            .from('addresses')
            .update({ address })
            .eq('id', id);
        if (error) throw new BadRequestException('Error al editar la direccion: ' + error.message);
        return data;
    }
}

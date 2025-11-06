import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { AddressRepository } from 'src/address/domain/contract/address.repository';
import Address from '../../domain/models/address';
import { json } from 'node:stream/consumers';


@Injectable()
export class SupabaseAddressRepository implements AddressRepository {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient) {}

    async createAddress(address : Address) {

        const verify = await this.VerifyExistAddressForUserIDandStreetAddress(address.getUser_id(), address.getStreet_address());
        
        if (verify) {
            throw new BadRequestException({
                message: 'Ya existe esta dirección para este usuario',
                code: 'ADDRESS_EXISTS',
                hint: 'Intentá con una dirección diferente'
            });
        }
        const { data, error } = await this.supabaseClient
            .from('addresses')
            .insert({ 
                user_id: address.getUser_id(),
                street_address: address.getStreet_address(),
                city: address.getCity(),
                postal_code: address.getPostal_code(), 
                latitude: address.getLat(),
                longitude: address.getLng(),
                details: address?.getDetails(),
            });
        if (error) throw error;
        return "Dirección creada con éxito ";
    }

    async findAllAddressByUserID(user_id:string): Promise<Address[]> {
        const { data, error } = await this.supabaseClient
            .from('addresses')
            .select('*')
            .eq('user_id', user_id);
        if (error) throw new BadRequestException('Error al obtener las direcciones: ' + error.message);
        return data as Address[];
    }

    async VerifyExistAddressForUserIDandStreetAddress(user_id:string, street_address?:string): Promise<boolean> {
        const { data, error } = await this.supabaseClient
            .from('addresses')
            .select('*')
            .eq('user_id', user_id)
            .eq('street_address', street_address);
        if (error) throw new BadRequestException('Error al verificar la dirección: ' + error.message);
        return data && data.length > 0;
    }

    async EditAdressByID(address: Address): Promise<any> {

        const verify = await this.VerifyExistAddressForUserIDandStreetAddress(address.getUser_id(), address.getStreet_address());
        
        if (verify) {
            throw new BadRequestException('Ya existe esta direccion para este usuario');
        }


        const { data, error } = await this.supabaseClient
            .from('addresses')
            .update({
                street_address:address.getStreet_address(),
                city:address?.getCity(),
                postal_code:address?.getPostal_code()
                ,details:address?.getDetails()})
            .eq('id', address.getId())
            .eq('user_id', address.getUser_id());
        if (error) throw new BadRequestException('Error al editar la direccion: ' + error.message);

        return "Dirección actualizada con éxito";
    }

    async deleteAddress(user_id:string, id:string): Promise<any> {
        
        const { data, error } = await this.supabaseClient
            .from('addresses')
            .delete()
            .eq('id', id)
            .eq('user_id', user_id);
        if (error) throw new BadRequestException('Error al eliminar la direccion: ' + error.message);
        return "Dirección eliminada con éxito";
    }
}

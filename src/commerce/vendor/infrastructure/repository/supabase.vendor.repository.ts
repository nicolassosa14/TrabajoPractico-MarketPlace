import { VendorRepository } from 'src/commerce/vendor/domain/contract/vendor.repository';
import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import Vendor from 'src/commerce/vendor/domain/models/vendor';
import UpdatePutVendorCommand from 'src/commerce/vendor/service/DTO/UpdateVendorCommand.dto';
import { IsAlpha } from 'class-validator';
import UpdatePatchVendorCommand from 'src/commerce/vendor/service/DTO/UpdateVendorCommand.dto';
@Injectable()
export class SupabaseVendorRepository implements VendorRepository {
    constructor(@Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient) { }

    async createVendor(vendor: Vendor): Promise<any> {
        const { data, error } = await this.supabaseClient.auth.signUp({
            email: vendor.getEmail(),
            password: vendor.getPassword()
        })

        if (error) {
            throw new Error('Vendor no creado: ' + error.message)
        }

    }


    async update(command: Vendor): Promise<any> {
        const { data, error } = await this.supabaseClient
            .from('vendors')
            .update({
                name: command.getName(),
                email: command.getEmail(),
                password: command.getPassword(),
                descripcion: command.getDescripcion(),
                is_active: command.getisActive(),
            })

            .eq('id', command.getId())
            .select()

        if (error) {
            throw new Error('Vendor no actualizado: ' + error.message)
        }
    }



    async updatePartial(vendor: UpdatePatchVendorCommand): Promise<any> {
        const updateData: any = {};
        if (vendor.getName()) updateData.name = vendor.getName();
        if (vendor.getEmail()) updateData.email = vendor.getEmail();
        if (vendor.getPassword()) updateData.password = vendor.getPassword();
        if (vendor.getDescripcion()) updateData.descripcion = vendor.getDescripcion();
        if (vendor.getIsActive() !== undefined) updateData.is_active = vendor.getIsActive();
        if (vendor.getAddress()) updateData.address = vendor.getAddress();

        const { data, error } = await this.supabaseClient
            .from('vendors')
            .update(updateData)
            .eq('id', vendor.getId())
            .select()

        if (error) {
            throw new Error('Vendor no actualizado: ' + error.message)
        }
    }

    async findByEmail(email: string): Promise<Vendor> {
        const { data, error } = await this.supabaseClient
            .from('vendors')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            throw new Error('Vendor no encontrado: ' + error.message)
        }

        return data;

    }


    async findById(id: number): Promise<Vendor> {
        const { data, error } = await this.supabaseClient
            .from('vendors')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new Error('Vendor no encontrado: ' + error.message);
        }

        return data;
    }


}
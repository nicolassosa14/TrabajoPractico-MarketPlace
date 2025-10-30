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
        const { data: existingVendor, error: existingVendorError } = await this.supabaseClient
            .from('vendors')
            .select('*')
            .eq('user_id', vendor.getUserId())
            .maybeSingle();

        if (existingVendor) {
            throw new Error('El usuario ya tiene un vendor asociado.');
        }

        
        const { data: profileData, error: profileError } = await this.supabaseClient
            .from('profiles') 
            .select('role')
            .eq('id', vendor.getUserId()) 
            .single();

        if (profileError || !profileData || profileData.role !== 'vendor') {
            throw new Error('Acción no permitida. El usuario no tiene el rol de vendor.');
        }

        const { data: insertarData, error: errorInsert } = await this.supabaseClient
            .from('vendors')
            .insert({
                name: vendor.getName(),
                description: vendor.getDescription(),
                address: vendor.getAddress(),
                is_active: vendor.getisActive(),
                user_id: vendor.getUserId(),
            })
            .select()
            .single();

        if (errorInsert) {
            throw new Error('Vendor no creado: ' + errorInsert.message)
        }
        return insertarData;
    }


    async update(command: Vendor): Promise<any> {
        const { data, error } = await this.supabaseClient
            .from('vendors')
            .update({
                name: command.getName(),
                address: command.getAddress(),
                descripcion: command.getDescription(),
                is_active: command.getisActive(),
            })

            .eq('id', command.getId())
            .select()

        if (error) {
            throw new Error('Vendor no actualizado: ' + error.message)
        }
        return data;
    }



    async updatePartial(vendor: UpdatePatchVendorCommand): Promise<any> {
        const updateData: any = {};
        if (vendor.getName()) updateData.name = vendor.getName();
        if (vendor.getEmail()) updateData.email = vendor.getEmail();
        if (vendor.getPassword()) updateData.password = vendor.getPassword();
        if (vendor.getDescription()) updateData.descripcion = vendor.getDescription();
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
        return data;
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

    async findAll(): Promise<Vendor[]> {
        const { data, error } = await this.supabaseClient
            .from('vendors')
            .select('*');

        if (error) {
            throw new Error('Error buscando vendors: ' + error.message);
        }

        return data.map(v => new Vendor(
            v.description,
            v.address,
            v.is_active,
            v.user_id,
            v.name,
            v.id
        ));
    }


}
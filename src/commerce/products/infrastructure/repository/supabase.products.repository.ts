import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import Product from '../../domain/models/products';
import { ProductRepository } from '../../domain/contract/products.respository';

@Injectable()
export class SupabaseProductRepository implements ProductRepository {
    constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient) { }

    async createProduct(product: Product): Promise<Product> {
        const { data, error } = await this.supabase
            .from('products')
            .insert([{
                vendor_id: product.getVendorId(),
                name: product.getName(),
                description: product.getDescription(),
                price: product.getPrice(),
                image_url: product.getImageUrl(),
                is_available: product.getIsAvailable()
            }])
            .select()
            .single();

        if (error) throw new Error(error.message);
        // Mapea el objeto plano de la base de datos a una instancia del modelo de dominio
        return new Product(
            data.name,
            data.description,
            data.image_url,
            data.price,
            data.is_available,
            data.vendor_id,
            data.id,
        );
    }

    async findById(id: number): Promise<Product | null> {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw new Error(error.message); // PGRST116 = no rows
        if (!data) return null;
        // Mapea el objeto plano a una instancia del modelo
        return new Product(
            data.name,
            data.description,
            data.image_url,
            data.price,
            data.is_available,
            data.vendor_id,
            data.id,
        );
    }

    async findAll(): Promise<Product[]> {
        const { data, error } = await this.supabase
            .from('products')
            .select('*');

        if (error) throw new Error(error.message);

        return data.map(p => new Product(
            p.name,
            p.description,
            p.image_url,
            p.price,
            p.is_available,
            p.vendor_id,
            p.id
        ));
    }
    async findByVendorId(vendorId: string | number): Promise<Product[]> {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('vendor_id', vendorId);

        if (error) throw new Error(error.message);
        // Mapea cada objeto del array a una instancia del modelo
        return data.map(p => new Product(
            p.name,
            p.description,
            p.image_url,
            p.price,
            p.is_available,
            p.vendor_id,
            p.id
        ));
    }

    // Opción A: consulta en una sola llamada usando relación (recomendado si la relación está expuesta)
    async findByVendorName(vendorName: string): Promise<Product[]> {
        const { data, error } = await this.supabase
            .from('products')
            .select('*, vendors(name)')
            .eq('vendors.name', vendorName);

        if (!error) return data.map(p => new Product(
            p.name,
            p.description,
            p.image_url,
            p.price,
            p.is_available,
            p.vendor_id,
            p.id
        ));

        const { data: vendor, error: vendorErr } = await this.supabase
            .from('vendors')
            .select('id')
            .eq('name', vendorName)
            .single();

        if (vendorErr) throw new Error(vendorErr.message);
        const { data: products, error: prodErr } = await this.supabase
            .from('products')
            .select('*')
            .eq('vendor_id', vendor.id);

        if (prodErr) throw new Error(prodErr.message);
        return products.map(p => new Product(
            p.name,
            p.description,
            p.image_url,
            p.price,
            p.is_available,
            p.vendor_id,
            p.id
        ));
    }

    async update(product: Product): Promise<Product> {
        const updateData: any = {
            name: product.getName(),
            description: product.getDescription(),
            price: product.getPrice(),
            image_url: product.getImageUrl(),
            is_available: product.getIsAvailable(),
        };
        const { data, error } = await this.supabase
            .from('products')
            .update(updateData)
            .eq('id', product.getId())
            .select()
            .single();

        if (error) throw new Error(error.message);
        return new Product(
            data.name,
            data.description,
            data.image_url,
            data.price,
            data.is_available,
            data.vendor_id,
            data.id,
        );
    }

    async delete(id: number): Promise<void> {
        const { error } = await this.supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    async assignCategories(productId: number, categoryIds: number[]): Promise<void> {
       
        const { error } = await this.supabase.rpc('assign_product_categories', {
            p_product_id: productId,
            p_category_ids: categoryIds,
        });

        if (error) throw new Error(error.message);
    }
}
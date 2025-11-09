import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import Product from '../../domain/models/products';
import { ProductRepository } from '../../domain/contract/products.respository';
function normalizeText(text: string): string {
  return text
    .normalize('NFD')               // descompone caracteres con tildes (á -> a + ́)
    .replace(/[\u0300-\u036f]/g, '') // elimina los acentos
    .toLowerCase()
    .trim();
}

@Injectable()
export class SupabaseProductRepository implements ProductRepository {
    constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient) { }

     async createProduct(product: Product): Promise<Product> {
    const userId = product.getVendorId();
console.log('userId:', userId);
    const { data: vendorData, error: vendorError } = await this.supabase
      .from('vendors')
      .select('id, user_id, name')
      .eq('user_id', userId)
      .maybeSingle();

    if (vendorError) {
      throw new Error('Error al consultar vendors: ' + vendorError.message);
    }

    if (!vendorData) {
      throw new Error('No se encontró un vendor asociado a este usuario.');
    }

    const { data: productData, error: productError } = await this.supabase
      .from('products')
      .insert({
        name: product.getName(),
        description: product.getDescription(),
        image_url: product.getImageUrl(),
        price: product.getPrice(),
        is_available: product.getIsAvailable(),
        vendor_id: vendorData.id,
        category_ids: product.getCategoryIds()
      })
      .select()
      .single();

    if (productError) {
      throw new Error('Error al crear el producto: ' + productError.message);
    }

    return new Product(
      productData.name,
      productData.description,
      productData.image_url,
      productData.price,
      productData.is_available,
      productData.vendor_id,
      productData.category_ids,
      productData.id
    );
  }


    async findById(id: number): Promise<Product | null> {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw new Error(error.message); // PGRST116 = no hay filas coincidentes
        if (!data) return null;

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

    async assignCategories(productId: number, categoryIds: string): Promise<void> {

        const { error } = await this.supabase.rpc('assign_product_categories', {
            p_product_id: productId,
            p_category_ids: categoryIds,
        });

        if (error) throw new Error(error.message);
    }

 async findByCategoryName(categoryName: string): Promise<Product[]> {
  const normalizedInput = normalizeText(categoryName);

  const { data: allCategories, error: catError } = await this.supabase
    .from('categories')
    .select('id, name');

  if (catError) throw new Error('Error consultando categorías: ' + catError.message);

  const category = allCategories?.find(
    c => normalizeText(c.name) === normalizedInput
  );

  if (!category) throw new Error(`No se encontró la categoría: ${categoryName}`);

  const { data: products, error: prodError } = await this.supabase
    .from('products')
    .select('*')
    .eq('category_ids', category.id);

  if (prodError) throw new Error('Error al consultar productos por categoría: ' + prodError.message);

  return products ?? [];
}


}








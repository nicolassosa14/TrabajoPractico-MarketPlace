import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import ProductCategory from '../../model/Product_Category';
import { ProductCategoryRepository } from '../../contract/Product_category.repository';

@Injectable()
export class SupabaseProductCategoryRepository implements ProductCategoryRepository {
    constructor(
        @Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient
    ) {}

    async assignCategories(productId: number | string, categoryIds: number[]): Promise<void> {
        if (!categoryIds || categoryIds.length === 0) return;
        const rows = categoryIds.map(id => ({ product_id: productId, category_id: id }));
        const { error } = await this.supabaseClient
            .from('product_categories')
            .upsert(rows); 

        if (error) throw new Error(error.message);
    }

    async removeCategories(productId: number | string, categoryIds?: number[]): Promise<void> {
        let query = this.supabaseClient
            .from('product_categories')
            .delete()
            .eq('product_id', productId);

        if (categoryIds && categoryIds.length > 0) {
            // .in acepta arreglo
            query = (query as any).in('category_id', categoryIds);
        }

        const { error } = await query;
        if (error) throw new Error(error.message);
    }

  
    async syncCategories(productId: number | string, categoryIds: number[]): Promise<void> {
        
        if (!categoryIds || categoryIds.length === 0) {
            const { error } = await this.supabaseClient
                .from('product_categories')
                .delete()
                .eq('product_id', productId);
            if (error) throw new Error(error.message);
            return;
        }

        // 1) Upsert de las asociaciones solicitadas
        const rows = categoryIds.map(id => ({ product_id: productId, category_id: id }));
        const { error: upsertErr } = await this.supabaseClient
            .from('product_categories')
            .upsert(rows);
        if (upsertErr) throw new Error(upsertErr.message);

        // Borrar aquellas que no estan en categoryIds
        const idsList = categoryIds.join(',');
        const { error: delErr } = await this.supabaseClient
            .from('product_categories')
            .delete()
            .eq('product_id', productId)
            .not('category_id', 'in', `(${idsList})`);
        if (delErr) throw new Error(delErr.message);
    }

    async getCategoriesForProduct(productId: number | string): Promise<number[]> {
        const { data, error } = await this.supabaseClient
            .from('product_categories')
            .select('category_id')
            .eq('product_id', productId);

        if (error) throw new Error(error.message);
        return (data ?? []).map((r: any) => r.category_id);
    }

    async getProductsForCategory(categoryId: number): Promise<(number | string)[]> {
        const { data, error } = await this.supabaseClient
            .from('product_categories')
            .select('product_id')
            .eq('category_id', categoryId);

        if (error) throw new Error(error.message);
        return (data ?? []).map((r: any) => r.product_id);
    }
}
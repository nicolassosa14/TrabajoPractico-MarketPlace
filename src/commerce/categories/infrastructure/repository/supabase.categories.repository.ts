import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common/decorators";
import { SupabaseClient } from "@supabase/supabase-js";
import { CategoryRepository } from "../../domain/contract/categories.repository";
import categories from "../../domain/models/categories";


@Injectable()

export class SupabaseCategoryRepository implements CategoryRepository {
    constructor(@Inject('SUPABASE_CLIENT') private readonly supabaseClient: SupabaseClient) { }

    async createcategories(categories: categories): Promise<any> {
        const { data, error } = await this.supabaseClient.from('categories').insert(categories);
        if (error) {
            throw new Error('Category no creado: ' + error.message)
        }
        return data;
    }

    async updateCategories(categories: categories): Promise<any> {
        const { data, error } = await this.supabaseClient
            .from('categories')
            .update({
                name: categories.getName(),
                description: categories.getDescription(),
            })
            .eq('id', categories.getId())
            .select()
        if (error) {
            throw new Error('Category no actualizado: ' + error.message)
        }
        return data;
    }
    async findAll(name?: string): Promise<categories[]> {
        let query = this.supabaseClient.from('categories').select('*');

        if (name) {
            // Usamos ilike para una búsqueda "case-insensitive" que contenga el texto.
            query = query.ilike('name', `%${name}%`);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error('Error buscando categorías: ' + error.message);
        }

        return data.map(cat => new categories(cat.name, cat.description, cat.id));
    }
}

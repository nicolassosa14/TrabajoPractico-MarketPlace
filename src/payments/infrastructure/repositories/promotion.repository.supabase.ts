// src/modules/payments/infrastructure/repositories/promotion.repository.supabase.ts
import { PromotionRepository } from '../../domain/repositories/promotion.repository';
import { Promotion } from '../../domain/entities/promotion.entity';
import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class PromotionRepositorySupabase implements PromotionRepository {
constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient) {}

    async findByCode(code: string): Promise<Promotion | null> {
        const { data, error } = await this.supabase.from('promotions').select('*').eq('code', code).single();
        if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
        }
        if (!data) return null;
        return new Promotion(
        data.id,
        data.code,
        data.description,
        data.discount_type,
        Number(data.discount_value),
        data.expires_at ? new Date(data.expires_at) : null,
        data.is_active
        );
    }
    }

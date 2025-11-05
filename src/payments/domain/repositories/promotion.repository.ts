import { Promotion } from '../entities/promotion.entity';

export interface PromotionRepository {
    findByCode(code: string): Promise<Promotion | null>;
}

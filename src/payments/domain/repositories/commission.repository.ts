import { Commission } from '../entities/commission.entity';

export interface CommissionRepository {
    create(commission: Commission): Promise<Commission>;
    
}
// src/modules/payments/infrastructure/repositories/commission.repository.supabase.ts
import { CommissionRepository } from '../../domain/repositories/commission.repository';
import { Commission } from '../../domain/entities/commission.entity';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CommissionRepositorySupabase implements CommissionRepository {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient) {}

  async create(commission: Commission): Promise<Commission> {
    const { data, error } = await this.supabase.from('commissions').insert({
      id: commission.id,
      order_id: commission.orderId,
      platform_fee: commission.platformFee,
      vendor_earning: commission.vendorEarning,
      driver_earning: commission.driverEarning,
    }).select().single();
    if (error) throw error;
    return new Commission(data.id, data.order_id, Number(data.platform_fee), Number(data.vendor_earning), Number(data.driver_earning));
  }

  


}

import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { rowToPayment, paymentToRow } from '../mappers/payment.mapper';

@Injectable()
    export class PaymentRepositorySupabase implements PaymentRepository {
    constructor(
        @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    ) {}

    async create(payment: Payment): Promise<Payment> {
        const payload = paymentToRow(payment);
        const { data, error } = await this.supabase
        .from('payments')
        .insert(payload)
        .select()
        .single();
        if (error) throw error;
        return rowToPayment(data);
    }

    async findById(id: string): Promise<Payment | null> {
        const { data, error } = await this.supabase
        .from('payments')
        .select('*')
        .eq('id', id)
        .single();

        if (error) {
            
        if ((error as any).code === 'PGRST116' || (error as any).status === 404) return null;
        throw error;
        }
        if (!data) return null;
        return rowToPayment(data);
    }

    async findByOrder(orderId: string): Promise<Payment[]> {
        const { data, error } = await this.supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId);

        if (error) throw error;
        return (data || []).map(rowToPayment);
    }

    async findByTransactionId(transactionId: string): Promise<Payment | null> {
        const { data, error } = await this.supabase
        .from('payments')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();

        if (error) {
        if ((error as any).code === 'PGRST116' || (error as any).status === 404) return null;
        throw error;
        }
        if (!data) return null;
        return rowToPayment(data);
    }

    async update(payment: Payment): Promise<Payment> {
        const payload = {
        amount: payment.amount,
        tip_amount: payment.tipAmount ?? 0,
        payment_method: payment.paymentMethod,
        status: payment.status,
        transaction_id: payment.transactionId ?? null,
        };

        const { data, error } = await this.supabase
        .from('payments')
        .update(payload)
        .eq('id', payment.id)
        .select()
        .single();

        if (error) throw error;
        return rowToPayment(data);
    }
}

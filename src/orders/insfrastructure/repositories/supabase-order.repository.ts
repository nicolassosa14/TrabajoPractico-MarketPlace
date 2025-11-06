import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { OrderRepository } from '../../application/ports/order.repository';
import { Order } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';

@Injectable()
export class SupabaseOrderRepository implements OrderRepository {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async create(order: Partial<Order>): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Order;
  }

  async updateStatus(orderId: string, status: string): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Order;
  }

  async findAll(): Promise<Order[]> {
    const { data, error } = await this.supabase.from('orders').select('*');
    if (error) throw new Error(error.message);
    return data as Order[];
  }

  async findById(orderId: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    if (error) throw new Error(error.message);
    return data as Order;
  }
}

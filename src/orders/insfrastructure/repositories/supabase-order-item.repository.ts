import { Injectable, Inject } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OrderItemRepository } from 'src/orders/application/ports/order-item.repository';
import { OrderItem } from 'src/orders/domain/entities/order-item.entity';

@Injectable()
export class SupabaseOrderItemRepository implements OrderItemRepository {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async add(item: OrderItem): Promise<OrderItem> {
    const { data, error } = await this.supabase
      .from('order_items')
      .insert({
        order_id: item.orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price_at_purchase,
      })
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async remove(orderId: string, productId: string): Promise<void> {
    const { error } = await this.supabase
      .from('order_items')
      .delete()
      .eq('order_id', orderId)
      .eq('product_id', productId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async updateQuantity(
    orderId: string,
    productId: string,
    quantity: number,
  ): Promise<OrderItem> {
    const { data, error } = await this.supabase
      .from('order_items')
      .update({ quantity })
      .eq('order_id', orderId)
      .eq('product_id', productId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async getItemsByOrder(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await this.supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

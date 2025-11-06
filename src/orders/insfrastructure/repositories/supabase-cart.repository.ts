import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import type { CartRepository } from 'src/orders/application/ports/cart.repository';
import { CartItem } from 'src/orders/domain/entities/cart-item.entity';

@Injectable()
export class SupabaseCartRepository implements CartRepository {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async add(item: CartItem): Promise<CartItem> {
    const { data, error } = await this.supabase
      .from('cart_items')
      .insert({
        user_id: item.userId,
        product_id: item.productId,
        quantity: item.quantity,
        added_at: item.addedAt,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(userId: string, productId: string): Promise<void> {
    await this.supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
  }

  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem> {
    const { data } = await this.supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
      .single();

    return new CartItem(
      data.user_id,
      data.product_id,
      data.quantity,
      data.added_at,
    );
  }

  async getByUser(userId: string): Promise<CartItem[]> {
    const { data, error } = await this.supabase
      .from('cart_items')
      .select()
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
    return data;
  }

  async clearCart(userId: string): Promise<void> {
    await this.supabase.from('cart_items').delete().eq('user_id', userId);
  }
}

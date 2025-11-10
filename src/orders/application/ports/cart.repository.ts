import { CartItem } from 'src/orders/domain/entities/cart-item.entity';

export abstract class CartRepository {
  abstract add(item: CartItem): Promise<CartItem>;
  abstract remove(userId: string, productId: string): Promise<void>;
  abstract updateQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem>;
  abstract getByUser(userId: string): Promise<CartItem[]>;
  abstract clearCart(userId: string): Promise<void>;
}

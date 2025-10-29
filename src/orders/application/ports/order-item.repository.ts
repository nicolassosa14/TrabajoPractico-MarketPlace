import { OrderItem } from "src/orders/domain/entities/order-item.entity";

export abstract class OrderItemRepository {
    abstract add(item: OrderItem): Promise<OrderItem>;
    abstract remove(orderId: string, productId: string): Promise<void>;
    abstract updateQuantity(orderId: string, productId: string, quantity: number): Promise<OrderItem>;
    abstract getItemsByOrder(orderId: string): Promise<OrderItem[]>;
}
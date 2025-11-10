import { Order } from '../../domain/entities/order.entity';

export abstract class OrderRepository {
  abstract create(order: Partial<Order>): Promise<Order>;
  abstract updateStatus(orderId: string, status: string): Promise<Order>;
  abstract findAll(): Promise<Order[]>;
  abstract findById(orderId: string): Promise<Order | null>;
}

import { Inject, Injectable } from '@nestjs/common';
import { OrderItem } from 'src/orders/domain/entities/order-item.entity';
import type { OrderItemRepository } from '../ports/order-item.repository';

@Injectable()
export class AddOrderItemService {
  constructor(
    @Inject('OrderItemRepository')
    private readonly OrderItemRepository: OrderItemRepository,
  ) {}

  async execute(item: OrderItem) {
    if (item) {
      return this.OrderItemRepository.add(item);
    }
    return this.OrderItemRepository.add(item);
  }
}

import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../ports/order.repository';
import { Order } from '../../domain/entities/order.entity';

@Injectable()
export class GetOrdersService {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(): Promise<Order[]> {
        return this.orderRepository.findAll();
    }
}
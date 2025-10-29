import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../ports/order.repository';
import { Order } from '../../domain/entities/order.entity';

@Injectable()
export class GetOrdersService{
    constructor(
        @Inject('OrderRepository')
        private readonly orderRepository: OrderRepository,
    ) {}

    async execute(userId?: string){
        if(userId) {
            return this.orderRepository.findById(userId);
        }
        return this.orderRepository.findAll();
    }
}
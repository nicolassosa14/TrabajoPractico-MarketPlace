import { Inject, Injectable } from "@nestjs/common";
import { OrderItem } from "../../domain/entities/order-item.entity";
import type { OrderItemRepository } from "../ports/order-item.repository";

@Injectable()
export class GetOrderItemsService {
    constructor(
        @Inject('OrderItemRepository')
        private readonly orderItemRepository: OrderItemRepository
    ) {}
    
    async execute(orderId: string) {
        if (orderId) {
            return this.orderItemRepository.getItemsByOrder(orderId);
        }
        return this.orderItemRepository.getItemsByOrder(orderId);
    }   
}
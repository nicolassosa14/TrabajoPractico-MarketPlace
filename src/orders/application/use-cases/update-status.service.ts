import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../ports/order.repository';
import { NotificationService } from '../ports/notification.service';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';
import { Order } from '../../domain/entities/order.entity';

@Injectable()
export class UpdateStatusService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly notificationService: NotificationService,
    ) {}

    async execute(orderId: string, status: OrderStatus): Promise<Order> {
        const updated = await this.orderRepository.updateStatus(orderId, status);

        await this.notificationService.sendNotification(
        updated.userId,
        `Tu pedido ahora está: ${status}`,
        );

        return updated;
    }
}
import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../ports/order.repository';
import { PaymentService } from '../ports/payment.service';
import { NotificationService } from '../ports/notification.service';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';
import { Order } from '../../domain/entities/order.entity';
import { randomUUID } from 'crypto';
import { In } from 'typeorm';

@Injectable()
export class CreateOrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,

    @Inject('PaymentService')
    private readonly paymentService: PaymentService,

    @Inject('NotificationService')
    private readonly notificationService: NotificationService,
  ) {}

  async execute(data: Partial<Order>): Promise<Order> {
    const order: Partial<Order> = {
      id: randomUUID(),
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      ...data,
    };

    const created = await this.orderRepository.create(order);

    // procesar pago
    await this.paymentService.processPayment(created.id, created.totalAmount);

    // notificar al vendedor
    await this.notificationService.sendNotification(
      created.vendorId,
      `Tienes un nuevo pedido de ${created.userId}`,
    );

    return created;
  }
}

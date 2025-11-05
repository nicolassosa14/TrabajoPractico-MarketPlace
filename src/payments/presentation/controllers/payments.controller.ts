// src/modules/payments/presentation/controllers/payments.controller.ts
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { CreatePaymentResponseDto } from '../dto/create-payment-response.dto';
import { Payment } from '../../domain/entities/payment.entity';
import { v4 as uuidv4 } from 'uuid';
import type { PaymentRepository } from '../../domain/repositories/payment.repository';

@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject('PaymentRepository') private readonly paymentRepo: PaymentRepository,
  ) {}

  @Post()
  async create(@Body() dto: CreatePaymentDto): Promise<CreatePaymentResponseDto> {
    const id = uuidv4();
    const payment = new Payment(id, dto.orderId, dto.amount, dto.tipAmount ?? 0, dto.paymentMethod);

    const saved = await this.paymentRepo.create(payment);

    return {
      paymentId: saved.id,
      status: saved.status,
      checkoutUrl: undefined,
    };
  }
}

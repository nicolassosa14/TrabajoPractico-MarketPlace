import { Injectable, Inject } from '@nestjs/common';
import type { PaymentRepository } from './domain/repositories/payment.repository';
import { Payment } from './domain/entities/payment.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreatePaymentDto } from './presentation/dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('PaymentRepository')  
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const id = uuidv4();
    const payment = new Payment(
      id,
      dto.orderId,
      dto.amount,
      dto.tipAmount ?? 0,
      dto.paymentMethod,
      'pending',
      `TX-${Math.floor(Math.random() * 100000)}`
    );
    return this.paymentRepository.create(payment);
  }

  async findOne(id: string): Promise<Payment | null> {
    return this.paymentRepository.findById(id);
  }
}

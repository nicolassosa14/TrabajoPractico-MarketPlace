import { Injectable } from '@nestjs/common';
import { PaymentService } from '../../application/ports/payment.service';

@Injectable()
export class PaymentAdapter implements PaymentService {
  async processPayment(orderId: string, amount: number): Promise<void> {
    console.log(`Procesando pago de $${amount} para la orden ${orderId}`);
  }
}

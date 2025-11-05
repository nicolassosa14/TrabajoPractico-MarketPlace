import { Payment } from '../entities/payment.entity';

export interface PaymentStrategy {
    process(payment: Payment): Promise<{ transactionId?: string; checkoutUrl?: string }>;
}
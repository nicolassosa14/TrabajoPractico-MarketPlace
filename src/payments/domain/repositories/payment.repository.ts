import { Payment } from '../../domain/entities/payment.entity';

export interface PaymentRepository {
    create(payment: Payment): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByOrder(orderId: string): Promise<Payment[]>;
    findByTransactionId(transactionId: string): Promise<Payment | null>;
    update(payment: Payment): Promise<Payment>;
}

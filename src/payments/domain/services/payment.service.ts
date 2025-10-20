import { Payment } from '../../entities/payment.entity';

export interface PaymentRepository {
    crear(payment: Payment): Promise<Payment>;
    obtenerPorId(id: string): Promise<Payment | null>;
    listar(): Promise<Payment[]>;
}


import { PaymentStrategy } from './payment.strategy';
import { Payment } from '../entities/payment.entity';

    export class CashStrategy implements PaymentStrategy {
    async process(payment: Payment): Promise<{ transactionId?: string; checkoutUrl?: string }> {
        // Para pago en efectivo simplemente marcamos pendiente o generamos un id local
        const tx = `CASH-${Date.now()}`;
        return { transactionId: tx };
    }
    }
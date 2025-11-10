import { PaymentStrategy } from './payment.strategy';
import { Payment } from '../entities/payment.entity';
import { MercadoPagoAdapter } from '../../infrastructure/adapters/mercado-pago.adapter';

    export class MercadoPagoStrategy implements PaymentStrategy {
    constructor(private adapter: MercadoPagoAdapter) {}

    async process(payment: Payment): Promise<{ transactionId?: string; checkoutUrl?: string }> {
        const pref = await this.adapter.createPreference({
        items: [
            {
            id: payment.id,
            title: `Order ${payment.orderId}`,
            unit_price: payment.amount + (payment.tipAmount || 0),
            quantity: 1,
            },
        ],
        external_reference: payment.id,
        });

        // MP devuelve id y init_point
        const transactionId = pref.id;
        const checkoutUrl = pref.init_point || pref.sandbox_init_point;
        return { transactionId, checkoutUrl };
    }
    }

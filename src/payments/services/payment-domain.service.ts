import { Payment } from '../domain/entities/payment.entity';
import { Promotion } from '../domain/entities/promotion.entity';
import { Commission } from '../domain/entities/commission.entity';

export class PaymentDomainService {
    applyPromotion(payment: Payment, promo?: Promotion): void {
        if (!promo) return;
        if (!promo.isValid()) return;
        payment.amount = promo.apply(payment.amount);
    }

    createCommission(payment: Payment, platformRate: number): Commission {
        const platformFee = Number((payment.amount * platformRate).toFixed(2));
        const vendorEarning = Number((payment.amount - platformFee).toFixed(2));
        const driverEarning = Number((payment.tipAmount || 0).toFixed(2));
        return new Commission(crypto.randomUUID(), payment.orderId, platformFee, vendorEarning, driverEarning);
    }
    }
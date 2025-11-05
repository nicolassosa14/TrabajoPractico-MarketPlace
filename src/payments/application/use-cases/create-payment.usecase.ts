// src/modules/payments/application/use-cases/create-payment.usecase.ts
import { CreatePaymentDto } from '../../presentation/dto/create-payment.dto';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { PromotionRepository } from '../../domain/repositories/promotion.repository';
import { CommissionRepository } from '../../domain/repositories/commission.repository';
import { PaymentDomainService } from '../../services/payment-domain.service';
import { PaymentStrategy } from '../../domain/strategies/payment.strategy';
import { Commission } from '../../domain/entities/commission.entity';
import { CreatePaymentResponseDto } from '../../presentation/dto/create-payment-response.dto';
import { Promotion } from '../../domain/entities/promotion.entity';

    export class CreatePaymentUseCase {
    constructor(
        private paymentRepo: PaymentRepository,
        private promotionRepo: PromotionRepository,
        private commissionRepo: CommissionRepository,
        private domainService: PaymentDomainService,
        private strategyFactory: (method: string) => PaymentStrategy,
        private platformRate: number,
    ) {}

    async execute(dto: CreatePaymentDto): Promise<CreatePaymentResponseDto> {
        // 1. crear entidad
        const id = crypto.randomUUID();
        const payment = new Payment(id, dto.orderId, dto.amount, dto.tipAmount ?? 0, dto.paymentMethod);

        // 2. aplicar promo (si existe)
        let appliedPromotion: Promotion | null = null;
        if (dto.promotionCode) {
        const promo = await this.promotionRepo.findByCode(dto.promotionCode);
        if (promo && promo.isValid()) {
            this.domainService.applyPromotion(payment, promo);
            appliedPromotion = promo;
        }
        }

        // 3. elegir strategy y procesar
        const strategy = this.strategyFactory(dto.paymentMethod);
        const { transactionId, checkoutUrl } = await strategy.process(payment);

        if (transactionId) payment.transactionId = transactionId;
        // si strategy devuelve tx, ya podemos decidir estado (pendiente/approved)
        // para MP queda pendiente hasta webhook/confirmacion => mantenemos 'pending'

        // 4. guardar payment
        const saved = await this.paymentRepo.create(payment);

        // 5. calcular y guardar commission
        const commission = this.domainService.createCommission(payment, this.platformRate);
        commission.orderId = payment.orderId;
        await this.commissionRepo.create(commission);

        // 6. devolver respuesta al cliente
        return {
        paymentId: saved.id,
        status: saved.status,
        checkoutUrl,
        message: appliedPromotion?.code ? `Promotion ${appliedPromotion.code} applied` : undefined,
        };
    }
    }

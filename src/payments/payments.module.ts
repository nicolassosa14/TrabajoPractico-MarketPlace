// src/modules/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { PaymentsController } from './presentation/controllers/payments.controller';
import { CreatePaymentUseCase } from './application/use-cases/create-payment.usecase';
import { PaymentRepositorySupabase } from './infrastructure/repositories/payment.repository.supabase';
import { PromotionRepositorySupabase } from './infrastructure/repositories/promotion.repository.supabase';
import { CommissionRepositorySupabase } from './infrastructure/repositories/commission.repository.supabase';
import { PaymentDomainService } from './services/payment-domain.service';
import { MercadoPagoAdapter } from './infrastructure/adapters/mercado-pago.adapter';
import { MercadoPagoStrategy } from './domain/strategies/mercado-pago.strategy';
import { CashStrategy } from './domain/strategies/cash.strategy';
import { PaymentStrategy } from './domain/strategies/payment.strategy';
import { PaymentsService } from './payments.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
            {
                provide: 'PaymentRepository',
                useClass: PaymentRepositorySupabase,
            },
    // Repositories
    // dentro de providers: []
    { provide: 'PaymentRepository', useClass: PaymentRepositorySupabase },
    { provide: 'PromotionRepository', useClass: PromotionRepositorySupabase },
    { provide: 'CommissionRepository', useClass: CommissionRepositorySupabase },

    // Domain services
    PaymentDomainService,

    // Adapter (MercadoPago) - factory provider to pass token
    {
      provide: 'MercadoPagoAdapter',
      useFactory: () => new MercadoPagoAdapter(),
    },

    // Strategies factory
    {
      provide: 'StrategyFactory',
      useFactory: (mpAdapter: MercadoPagoAdapter) => {
        return (method: string) => {
          if (method === 'mercado_pago') return new MercadoPagoStrategy(mpAdapter);
          return new CashStrategy();
        };
      },
      inject: ['MercadoPagoAdapter'],
    },

    // UseCase
    {
      provide: CreatePaymentUseCase,
      useFactory: (
        paymentRepo: any,
        promoRepo: any,
        commissionRepo: any,
        domainService: PaymentDomainService,
        strategyFactory: any
      ) => {
        const platformRate = Number(process.env.PLATFORM_COMMISSION_RATE || 0.1);
        return new CreatePaymentUseCase(
          paymentRepo,
          promoRepo,
          commissionRepo,
          domainService,
          strategyFactory,
          platformRate
        );
      },
      inject: ['PaymentRepository', 'PromotionRepository', 'CommissionRepository', PaymentDomainService, 'StrategyFactory'],
    },
  ],
  exports: [CreatePaymentUseCase],
})
export class PaymentsModule {}

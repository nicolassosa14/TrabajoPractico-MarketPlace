import { Module } from '@nestjs/common';
import { LogisticsService } from './service/logistics.service';
import { LogisticsController } from './presentation/logistics.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { SupabaseLogisticRepository } from './infraestructure/supabase.logistic.repository';

@Module({
  imports: [SupabaseModule],
  controllers: [LogisticsController],
  providers: [
    LogisticsService,
    {
      provide: 'LogisticRepository',
      useClass: SupabaseLogisticRepository,
    },
  ],
  exports: [LogisticsService, 'LogisticRepository'],
})
export class LogisticsModule {}

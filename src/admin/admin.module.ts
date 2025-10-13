import { Module } from '@nestjs/common';
import { AdminController } from './presentation/admin.controller';
import { AdminService } from './service/admin.service';
import { SupabaseAdminRepository } from './infrastructure/repositories/supabase.admin.repository';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: 'AdminRepository',
      useClass: SupabaseAdminRepository,
    },
  ],
  exports: [AdminService, 'AdminRepository'],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { VendorController } from './presentacion/vendor.controller';
import { VendorService } from './service/vendor.service';
import { SupabaseVendorRepository } from './infrastructure/repository/supabase.vendor.repository';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [VendorController],
  providers: [
    VendorService,
    {
      provide: 'VendorRepository',
      useClass: SupabaseVendorRepository,
    },
  ],
})
export class VendorModule { }

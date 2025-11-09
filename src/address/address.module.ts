import { Module } from '@nestjs/common';
import { AddressService } from './service/address.service';
import { AddressController } from './presentation/address.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { SupabaseAddressRepository } from './infrastructure/repositories/supabase.address.repository';

@Module({
  imports: [SupabaseModule],
  controllers: [AddressController],
  providers: [
    AddressService,
    {
      provide: 'AddressRepository',
      useClass: SupabaseAddressRepository,
    },
  ],
  exports: [AddressService, 'AddressRepository'],
})
export class AddressModule {}

import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserService } from './service/user.service';
import { SupabaseUserRepository } from './infrastructure/repositories/supabase.user.repository';
import { SupabaseModule } from '../supabase/supabase.module';
import { AddressModule } from '../address/address.module';
import { AddressController } from '../address/presentation/address.controller';

@Module({
  imports: [SupabaseModule, AddressModule], // Agregar esta línea
  controllers: [UserController, AddressController],
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: SupabaseUserRepository,
    },
  ],
  exports: [UserService, 'UserRepository'],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserController } from './presentacion/user.controller';
import { UserService } from './service/user.service';
import { SupabaseUserRepository } from './infrastructure/repositories/supabase.user.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: SupabaseUserRepository,
    },
  ],
})
export class UserModule {}

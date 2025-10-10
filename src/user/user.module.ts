import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserService } from './service/user.service';
import { SupabaseUserRepository } from './infrastructure/repositories/supabase.user.repository';
import { SupabaseModule} from '../supabase/supabase.module'

@Module({
    imports: [SupabaseModule], // Agregar esta línea
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: 'UserRepository',
            useClass: SupabaseUserRepository,
        },
    ],
    exports: [UserService, 'UserRepository']
})
export class UserModule {}

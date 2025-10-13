import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './vendor/vendor.module';
import { UserController } from './user/presentacion/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/service/user.service';
import { SupabaseModule } from './supabase/supabase.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [VendorModule, UserModule, SupabaseModule, AdminModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}

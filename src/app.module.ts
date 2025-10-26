import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './commerce/vendor/vendor.module';
import { UserController } from './user/presentacion/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/service/user.service';
import { SupabaseModule } from './supabase/supabase.module';
import { CommerceModule } from './commerce/commerce.module';
import { LogisticsModule } from './logistics/logistics.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './commerce/categories/categories.module';

@Module({
  imports: [VendorModule, UserModule, CommerceModule, LogisticsModule, OrdersModule, PaymentsModule, AdminModule, CategoriesModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}

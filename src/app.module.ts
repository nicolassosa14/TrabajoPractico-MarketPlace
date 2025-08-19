import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderController } from './order/order.controller';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [VendorModule],
  controllers: [AppController, OrderController],
  providers: [AppService],
})
export class AppModule {}

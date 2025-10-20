import { Module } from '@nestjs/common';
import { VendorController } from './presentacion/vendor.controller';
import { VendorService } from './service/vendor.service';

@Module({
  controllers: [VendorController],
  providers: [VendorService], 
})
export class VendorModule {}

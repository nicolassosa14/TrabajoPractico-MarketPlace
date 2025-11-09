import { Module } from '@nestjs/common';
import { CommerceService } from './commerce.service';
import { CommerceController } from './commerce.controller';

import { VendorModule } from './vendor/vendor.module';
import { CategoriesModule } from 'src/commerce/categories/categories.module';
import { ProductsModule } from './products/products.module';

@Module({
  controllers: [CommerceController],
  providers: [CommerceService],
  imports: [VendorModule, CategoriesModule, ProductsModule],
})
export class CommerceModule {}

import { Module } from '@nestjs/common';
import { CommerceService } from './commerce.service';
import { CommerceController } from './commerce.controller';
import { MenuModule } from './menu/menu.module';

@Module({
  controllers: [CommerceController],
  providers: [CommerceService],
  imports: [MenuModule],
})
export class CommerceModule {}

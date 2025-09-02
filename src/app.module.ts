import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './vendor/vendor.module';
import { UserController } from './user/presentacion/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/service/user.service';

@Module({
  imports: [VendorModule, UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}

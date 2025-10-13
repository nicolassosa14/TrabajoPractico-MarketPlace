import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/service/admin.service';
import CreateAdminCommand from './admin/service/DTO/CreateAdmin.dto';
import UpdateAdminCommand from './admin/service/DTO/UpdateAdmin.dto';
import DeleteAdminCommand from './admin/service/DTO/DeleteAdmin.dto';

@Module({
  imports: [AdminModule],
})
class TestModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(TestModule);
  const adminService = app.get(AdminService);

  try {
    console.log('🧪 Creando usuario vendor...');
    const newUser = await adminService.createUser(
      new CreateAdminCommand('FUNCIONA-HDP@gmail.com', '123456', 'vendor')
    );
    console.log('✅ Usuario creado:', newUser);

    console.log('🧪 Listando usuarios con rol vendor...');
    const vendors = await adminService.findAllByRole('vendor');
    console.log('✅ Vendors encontrados:', vendors);

    if (vendors.length > 0) {
      console.log('🧪 Actualizando usuario vendor...');
      const updated = await adminService.updateUser(
        new UpdateAdminCommand(vendors[0].id, 'updated_vendor@gmail.com', 'vendor')
      );
      console.log('✅ Usuario actualizado:', updated);

      console.log('🧪 Eliminando usuario vendor...');
      const deleted = await adminService.deleteUser(
        new DeleteAdminCommand(vendors[0].id)
      );
      console.log('✅ Usuario eliminado:', deleted);
    }

    console.log('🧪 Listando usuarios con rol driver...');
    const drivers = await adminService.findAllByRole('driver');
    console.log('✅ Drivers encontrados:', drivers);

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await app.close();
  }
}

bootstrap();

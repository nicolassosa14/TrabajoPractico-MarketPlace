// src/admin/presentation/admin.controller.ts
import { 
  Controller, Post, Patch, Delete, Get, Body, Param, ParseIntPipe, UseGuards 
} from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { AdminCreateUserDto } from '../dtos/create-user.dto';
import { AdminUpdateUserDto } from '../dtos/update-user.dto';
import { JwtAuthGuard } from '../../login/strategy/jwt-auth.guard';
import { RolesGuard } from '../../login/decorators/roles.guard';
import { Roles } from '../../login/decorators/roles.decorator';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard) 
@Roles('ADMIN')

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // -------------------------
  // Crear usuario
  // -------------------------
  @Post()
  async createUser(@Body() dto: AdminCreateUserDto) {
    return this.adminService.createUser(dto);
  }

  // -------------------------
  // Actualizar usuario
  // -------------------------
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.adminService.updateUser(id, dto);
  }

  // -------------------------
  // Eliminar usuario
  // -------------------------
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  // -------------------------
  // Listar todos los vendors y drivers
  // -------------------------
  @Get()
  async listUsers() {
    return this.adminService.listAll();
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUserById(id);
}
}

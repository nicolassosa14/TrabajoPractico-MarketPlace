import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import CreateAdminRequestDTO from './dto/CreateAdminRequest.dto';
import UpdateAdminRequestDTO from './dto/UpdateAdminRequest.dto';
import DeleteAdminRequestDTO from './dto/DeleteAdminRequest.dto';
import CreateAdminCommand from '../service/DTO/CreateAdmin.dto';
import UpdateAdminCommand from '../service/DTO/UpdateAdmin.dto';
import DeleteAdminCommand from '../service/DTO/DeleteAdmin.dto';

@Controller('/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Post('/create')
  async create(@Body() dto: CreateAdminRequestDTO) {
    const command = new CreateAdminCommand(dto.email, dto.password, dto.role);
    return this.adminService.createUser(command);
  }


  @Get('/list/:role')
  async listByRole(@Param('role') role: string) {
    return this.adminService.findAllByRole(role);
  }


  @Put('/update')
async update(@Body() dto: UpdateAdminRequestDTO) {
  const command = new UpdateAdminCommand(dto.id, dto.email, dto.password, dto.role);
  return this.adminService.updateUser(command);
}


  @Delete('/delete')
  async delete(@Body() dto: DeleteAdminRequestDTO) {
    const command = new DeleteAdminCommand(dto.id);
    return this.adminService.deleteUser(command);
  }
}

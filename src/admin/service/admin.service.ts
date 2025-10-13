import { Injectable, Inject } from '@nestjs/common';
import CreateAdminCommand from './DTO/CreateAdmin.dto';
import UpdateAdminCommand from './DTO/UpdateAdmin.dto';
import DeleteAdminCommand from './DTO/DeleteAdmin.dto';
import Admin from '../domain/model/admin';
import type { AdminRepository } from '../domain/contract/admin.repository';

@Injectable()
export class AdminService {
  constructor(@Inject('AdminRepository') private readonly adminRepo: AdminRepository) {}

  async createUser(command: CreateAdminCommand) {
    const admin = new Admin(command.getEmail(), command.getPassword(), command.getRole());
    return this.adminRepo.createUser(admin);
  }

  async findAllByRole(role: string) {
    return this.adminRepo.findAllByRole(role);
  }

  async updateUser(command: UpdateAdminCommand) {
    const admin = new Admin(
      command.getEmail() ?? '',
      '',
      command.getRole() ?? '',
      command.getId()
    );
    return this.adminRepo.updateUser(admin);
  }

  async deleteUser(command: DeleteAdminCommand) {
    return this.adminRepo.deleteUser(command.getId());
  }
}

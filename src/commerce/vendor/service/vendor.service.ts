import { Inject, Injectable } from '@nestjs/common';
import type { VendorRepository } from '../domain/contract/vendor.repository';
import CreateVendorCommand from '../service/DTO/CreateVendorCommand.dto';
import Vendor from '../domain/models/vendor';
import UpdatePatchVendorCommand, {
  UpdatePutVendorCommand,
} from './DTO/UpdateVendorCommand.dto';
import { NotFoundException } from '@nestjs/common';
import type { ProductRepository } from 'src/commerce/products/domain/contract/products.respository';

@Injectable()
export class VendorService {
  constructor(
    @Inject('VendorRepository')
    private readonly vendorRepository: VendorRepository,
  ) {}

  async createVendor(dto: CreateVendorCommand) {
    const vendor = new Vendor(
      dto.description,
      dto.address,
      dto.is_active,
      dto.user_id,
      dto.name,
      undefined, // id
    );

    return this.vendorRepository.createVendor(vendor);
  }

  async findById(id: number): Promise<Vendor | null> {
    const vendor = await this.vendorRepository.findById(id);
    if (!vendor) {
      throw new NotFoundException(`Vendor con  no encontrado`);
    }
    return vendor;
  }

  async findByEmail(email: string): Promise<Vendor | null> {
    const vendor = await this.vendorRepository.findByEmail(email);
    if (!vendor) {
      throw new NotFoundException(`Vendor con email ${email} no encontrado`);
    }
    return vendor;
  }

  async update(command: UpdatePutVendorCommand): Promise<Vendor> {
    await this.findById(command.getId());

    const vendorToUpdate = new Vendor(
      command.getDescription(),
      command.getAddress(), // Corregido para que coincida con el modelo
      command.getIsActive(),
      command.getName(),
    );

    return this.vendorRepository.update(vendorToUpdate);
  }

  async updatePartial(command: UpdatePatchVendorCommand): Promise<any> {
    await this.findById(command.getId());
    return this.vendorRepository.updatePartial(command);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorRepository.findAll();
  }
}

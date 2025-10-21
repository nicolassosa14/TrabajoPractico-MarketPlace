import { Injectable, Inject } from '@nestjs/common';
import CreateAddressCommand from './dto/CreateAddress.dto';
import UpdateAddressCommand from './dto/UpdateAddress.dto';
import type { AddressRepository } from '../domain/contract/address.repository';
import Address from '../domain/models/address';

@Injectable()
export class AddressService {
  constructor(
      @Inject('AddressRepository') private readonly addressRepository: AddressRepository,
    ) {}
  
  createAddress(dto: CreateAddressCommand) {
    return this.addressRepository.createAddress(dto);
  }

  findAllAddressByUserID(user_id: string) {
    return this.addressRepository.findAllAddressByUserID(user_id);
  }

  UpdateAddress(dto: UpdateAddressCommand) {
    const address = new Address(
      '', // user_id no se usa en update, solo para compatibilidad
      dto.street_address || '',
      dto.city || '',
      dto.postal_code || '',
      dto.details
    );
    return this.addressRepository.EditAdressByID(dto.id, address);
  }

}

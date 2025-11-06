import { Injectable, Inject } from '@nestjs/common';
import CreateAddressCommand from './dto/CreateAddress.dto';
import UpdateAddressCommand from './dto/UpdateAddress.dto';
import type { AddressRepository } from '../domain/contract/address.repository';
import Address from '../domain/models/address';
import DeleteAddressCommand from './dto/DeleteAddress.dto';

@Injectable()
export class AddressService {
  constructor(
    @Inject('AddressRepository')
    private readonly addressRepository: AddressRepository,
  ) {}

  createAddress(dto: CreateAddressCommand) {
    return this.addressRepository.createAddress(dto);
  }

  findAllAddressByUserID(user_id: string) {
    return this.addressRepository.findAllAddressByUserID(user_id);
  }

  UpdateAddress(dtoUpdate: UpdateAddressCommand) {
    const address = new Address(
      dtoUpdate.user_id,
      dtoUpdate.lat,
      dtoUpdate.long,
      dtoUpdate.postal_code,
      dtoUpdate.street_address,
      dtoUpdate.city,
      dtoUpdate.id,
      dtoUpdate.details,
    );

    return this.addressRepository.EditAdressByID(address);
  }

  deleteAddress(dto: DeleteAddressCommand) {
    return this.addressRepository.deleteAddress(dto.getUser_id(), dto.getId());
  }
}

import { Injectable, Inject } from '@nestjs/common';
import CreateAddressCommand from './dto/CreateAddress.dto';
import UpdateAddressCommand from './dto/UpdateAddress.dto';
import type { AddressRepository } from '../domain/contract/address.repository';

@Injectable()
export class AddressService {
  constructor(
      @Inject('AddressRepository') private readonly addressRepository: AddressRepository,
    ) {}
  
  
  createAddress(dto: CreateAddressCommand) {
    return this.addressRepository.createAddress(dto);
  }

}

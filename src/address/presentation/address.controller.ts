import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from '../service/address.service';
import CreateAddressRequestDTO from './dto/CreateAddress.dto';
import CreateAddressCommand from '../service/dto/CreateAddress.dto';

import UpdateAddressRequestDTO from './dto/UpdateAddress.dto';
import UpdateAddressCommand from '../service/dto/UpdateAddress.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  createAddressRequest(@Body() createAddressDto: CreateAddressRequestDTO) {
    const command = new CreateAddressCommand(createAddressDto.user_id, createAddressDto.street_address, createAddressDto.city, createAddressDto.postal_code, createAddressDto.details);
    return this.addressService.createAddress(command);
  }
  
}

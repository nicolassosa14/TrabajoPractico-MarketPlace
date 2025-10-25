import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from '../service/address.service';
import CreateAddressRequestDTO from './dto/CreateAddress.dto';
import CreateAddressCommand from '../service/dto/CreateAddress.dto';

import UpdateAddressRequestDTO from './dto/UpdateAddress.dto';
import UpdateAddressCommand from '../service/dto/UpdateAddress.dto';
import DeleteAddressRequestDTO from './dto/DeleteAddress.dto';
import DeleteAddressCommand from '../service/dto/DeleteAddress.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  createAddressRequest(@Body() createAddressDto: CreateAddressRequestDTO) {
    const command = new CreateAddressCommand(createAddressDto.user_id, createAddressDto.street_address, createAddressDto.city, createAddressDto.postal_code, createAddressDto.details);
    return this.addressService.createAddress(command);
  }

  @Get()
  findAllAddressByUserID(@Body() user_id: string) {
    return this.addressService.findAllAddressByUserID(user_id);
  }

  @Patch()
  updateAddressRequest(@Body() updateAddressDto: UpdateAddressRequestDTO) {
    const command = new UpdateAddressCommand(
      updateAddressDto.id,
      updateAddressDto.user_id,
      updateAddressDto.street_address, 
      updateAddressDto.city, 
      updateAddressDto.postal_code, 
      updateAddressDto.details
    );
    return this.addressService.UpdateAddress(command);
  }

  @Delete()
  deleteAddressRequest(@Body() deleteAddressDto: DeleteAddressRequestDTO) {
    const command = new DeleteAddressCommand(deleteAddressDto.user_id, deleteAddressDto.id);
    return this.addressService.deleteAddress(command);
  }
  
}

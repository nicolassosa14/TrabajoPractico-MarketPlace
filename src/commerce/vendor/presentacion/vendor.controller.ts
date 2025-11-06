import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Body,
} from '@nestjs/common';
import { VendorService } from '../service/vendor.service';
import { createVendorRequestDto } from './dto/CrearVendorRequest.dto';
import CreateVendorCommand from '../service/DTO/CreateVendorCommand.dto';
import PutVendorRequestDTO, {
  PatchVendorRequestDTO,
} from './dto/UpdateVendorRequest.dto';
import UpdatePatchVendorCommand, {
  UpdatePutVendorCommand,
} from '../service/DTO/UpdateVendorCommand.dto';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  async create(@Body() dto: createVendorRequestDto) {
    const command = new CreateVendorCommand(
      dto.name,
      dto.description,
      dto.address,
      dto.user_id,
      dto.is_active,
    );
    return this.vendorService.createVendor(command);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.findById(id);
  }

  @Get()
  async findAll() {
    return this.vendorService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PutVendorRequestDTO,
  ) {
    const command = new UpdatePutVendorCommand(
      id,
      dto.name,
      dto.email,
      dto.password,
      dto.descripcion,
      dto.address,
      dto.is_active,
    );
    return this.vendorService.update(command);
  }

  @Patch(':id')
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PatchVendorRequestDTO,
  ) {
    const command = new UpdatePatchVendorCommand(
      id,
      dto.name,
      dto.email,
      dto.password,
      dto.descripcion,
      dto.address,
      dto.is_active,
    );
    return this.vendorService.updatePartial(command);
  }
}

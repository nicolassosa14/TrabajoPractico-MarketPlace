import { Controller, Get, Patch, Param, Body, ParseIntPipe, Post } from '@nestjs/common';
import { UsuarioService } from '../service/usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../presentation/dto/update-usuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // Registro
  @Post('register')
  register(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.register(dto);
  }

  // Profile
  @Get('profile/:id')
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.getProfile(id);
  }

  @Patch('profile/:id')
  updateProfile(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
    return this.usuarioService.updateProfile(id, dto);
  }
}

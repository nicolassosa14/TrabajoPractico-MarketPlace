import { Controller, Post, Body } from '@nestjs/common';
import { UsuarioService } from '../service/usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('register')
  async register(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.register(dto);
  }
}

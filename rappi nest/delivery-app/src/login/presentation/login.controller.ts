// src/login/presentation/login.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { LoginService } from '../service/login.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  // POST /auth/login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.loginService.login(dto);
    if (!result) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return result;
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from '../presentation/login.controller';
import { LoginService } from '../service/login.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../presentation/dto/login.dto';

describe('LoginController', () => {
  let controller: LoginController;
  let loginService: { login: jest.Mock };

  beforeEach(async () => {
    loginService = {
      login: jest.fn(), 
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        { provide: LoginService, useValue: loginService },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return login result', async () => {
    const dto: LoginDto = { email: 'test@test.com', password: '1234' };
    const mockResult = {
      access_token: 'token',
      user: { id: 1, role: 'ADMIN', nombre: 'Juan', apellido: 'Perez', email: 'test@test.com' },
      role: 'ADMIN',
      redirectTo: '/admin',
    };

    loginService.login.mockResolvedValue(mockResult); 

    const result = await controller.login(dto);
    expect(result).toEqual(mockResult);
    expect(loginService.login).toHaveBeenCalledWith(dto);
  });

  it('should throw UnauthorizedException', async () => {
    const dto: LoginDto = { email: 'wrong@test.com', password: '1234' };
    loginService.login.mockRejectedValue(new UnauthorizedException());

    await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
  });
});

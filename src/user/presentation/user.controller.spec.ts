import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import CreateUserRequestDTO from './dto/CreateUser.dto';
import LoginUserRequestDTO from './dto/LoginUserRequest.dto';
import { PatchUserRequestDTO } from './dto/UpdateUser.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUserService = {
    createUser: jest.fn(),
    loginUser: jest.fn(),
    resendVerificationEmail: jest.fn(),
    getUserProfile: jest.fn(),
    EditUserInfo: jest.fn(),
    getUserWithAddresses: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUserRequest', () => {
    it('should create a user successfully', async () => {
      const dto: CreateUserRequestDTO = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
      };

      const mockResponse = {
        user: { id: 'uuid-123', email: 'test@example.com' },
        session: { access_token: 'token-123' },
      };

      mockUserService.createUser.mockResolvedValue(mockResponse);

      const result = await controller.createUserRequest(dto);

      expect(result).toEqual(mockResponse);
      expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
      expect(mockUserService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          password: dto.password,
          first_name: dto.first_name,
          last_name: dto.last_name,
        }),
      );
    });

    it('should map DTO to Command correctly', async () => {
      const dto: CreateUserRequestDTO = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
      };

      mockUserService.createUser.mockResolvedValue({});

      await controller.createUserRequest(dto);

      const command = mockUserService.createUser.mock.calls[0][0];
      expect(command.getEmail()).toBe('test@example.com');
      expect(command.getPassword()).toBe('password123');
      expect(command.getFirst_Name()).toBe('John');
      expect(command.getLast_Name()).toBe('Doe');
    });

    it('should propagate service errors', async () => {
      const dto: CreateUserRequestDTO = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
      };

      mockUserService.createUser.mockRejectedValue(
        new BadRequestException('User already exists'),
      );

      await expect(controller.createUserRequest(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('LoginUserRequest', () => {
    it('should login user successfully', async () => {
      const dto: LoginUserRequestDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        user: { id: 'uuid-123', email: 'test@example.com' },
        session: { access_token: 'token-123' },
      };

      mockUserService.loginUser.mockResolvedValue(mockResponse);

      const result = await controller.LoginUserRequest(dto);

      expect(result).toEqual(mockResponse);
      expect(mockUserService.loginUser).toHaveBeenCalledTimes(1);
    });

    it('should map login DTO to Command correctly', async () => {
      const dto: LoginUserRequestDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserService.loginUser.mockResolvedValue({});

      await controller.LoginUserRequest(dto);

      const command = mockUserService.loginUser.mock.calls[0][0];
      expect(command.getEmail()).toBe('test@example.com');
      expect(command.getPassword()).toBe('password123');
    });

    it('should propagate login errors', async () => {
      const dto: LoginUserRequestDTO = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockUserService.loginUser.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(controller.LoginUserRequest(dto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('resendVerificationEmailRequest', () => {
    it('should resend verification email successfully', async () => {
      const email = 'test@example.com';
      const mockResponse = { messageId: 'msg-123' };

      mockUserService.resendVerificationEmail.mockResolvedValue(mockResponse);

      const result = await controller.resendVerificationEmailRequest(email);

      expect(result).toEqual(mockResponse);
      expect(mockUserService.resendVerificationEmail).toHaveBeenCalledWith(
        email,
      );
    });

    it('should handle email parameter from URL path', async () => {
      const email = 'user@example.com';

      mockUserService.resendVerificationEmail.mockResolvedValue({});

      await controller.resendVerificationEmailRequest(email);

      expect(mockUserService.resendVerificationEmail).toHaveBeenCalledWith(
        'user@example.com',
      );
    });
  });

  describe('getUserProfileRequest', () => {
    it('should get user profile successfully', async () => {
      const userId = 'uuid-123';
      const mockProfile = {
        id: 1,
        user_id: userId,
        first_name: 'John',
        last_name: 'Doe',
      };

      mockUserService.getUserProfile.mockResolvedValue(mockProfile);

      const result = await controller.getUserProfileRequest(userId);

      expect(result).toEqual(mockProfile);
      expect(mockUserService.getUserProfile).toHaveBeenCalledWith(userId);
    });

    it('should throw BadRequestException when user_id is not provided', async () => {
      await expect(controller.getUserProfileRequest('')).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.getUserProfileRequest('')).rejects.toThrow(
        'Se requiere el ID del usuario',
      );
    });

    it('should throw BadRequestException when user_id is null', async () => {
      await expect(controller.getUserProfileRequest(null as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when user_id is undefined', async () => {
      await expect(
        controller.getUserProfileRequest(undefined as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('EditUserInfoRequest', () => {
    it('should update user info with all fields', async () => {
      const dto: PatchUserRequestDTO = {
        user_id: 'uuid-123',
        email: 'newemail@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        phone_number: '1234567890',
      };

      const mockResponse = {
        id: 1,
        user_id: 'uuid-123',
        email: 'newemail@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        phone_number: '1234567890',
      };

      mockUserService.EditUserInfo.mockResolvedValue(mockResponse);

      const result = await controller.EditUserInfoRequest(dto);

      expect(result).toEqual(mockResponse);
      expect(mockUserService.EditUserInfo).toHaveBeenCalledTimes(1);
    });

    it('should update user info with partial fields', async () => {
      const dto: PatchUserRequestDTO = {
        user_id: 'uuid-123',
        first_name: 'Jane',
      };

      mockUserService.EditUserInfo.mockResolvedValue({});

      await controller.EditUserInfoRequest(dto);

      // El controller solo pasa los campos definidos al command
      expect(mockUserService.EditUserInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'uuid-123',
        }),
      );
    });

    it('should throw BadRequestException when user_id is missing', async () => {
      const dto: PatchUserRequestDTO = {
        user_id: '',
        first_name: 'Jane',
      };

      await expect(controller.EditUserInfoRequest(dto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.EditUserInfoRequest(dto)).rejects.toThrow(
        'Se requiere el ID del usuario',
      );
    });

    it('should only include defined fields in update', async () => {
      const dto: PatchUserRequestDTO = {
        user_id: 'uuid-123',
        email: 'newemail@example.com',
        phone_number: '9876543210',
        // first_name y last_name son undefined
      };

      mockUserService.EditUserInfo.mockResolvedValue({});

      await controller.EditUserInfoRequest(dto);

      // Verificar que se llamó al servicio con los campos definidos
      expect(mockUserService.EditUserInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'uuid-123',
        }),
      );
    });
  });

  describe('getUserProfileWithAddresses', () => {
    it('should get user profile with addresses', async () => {
      const dto = { user_id: 'uuid-123' };
      const mockResponse = {
        id: 1,
        user_id: 'uuid-123',
        first_name: 'John',
        addresses: [
          { id: 1, street_address: '123 Main St' },
          { id: 2, street_address: '456 Oak Ave' },
        ],
      };

      mockUserService.getUserWithAddresses.mockResolvedValue(mockResponse);

      const result = await controller.getUserProfileWithAddresses(dto.user_id);

      expect(result).toEqual(mockResponse);
      expect(mockUserService.getUserWithAddresses).toHaveBeenCalledWith(
        'uuid-123',
      );
    });

    it('should handle user with no addresses', async () => {
      const dto = { user_id: 'uuid-123' };
      const mockResponse = {
        id: 1,
        user_id: 'uuid-123',
        addresses: [],
      };

      mockUserService.getUserWithAddresses.mockResolvedValue(mockResponse);

      const result = await controller.getUserProfileWithAddresses(dto.user_id);

      expect(result.addresses).toEqual([]);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '../domain/contract/user.repository';
import { AddressService } from '../../address/service/address.service';
import CreateUserCommand from './dto/CreateUser.dto';
import LoginUserCommand from './dto/LoginUser.dto';
import { PatchUserCommand } from './dto/UpdateUser.dto';
import User from '../domain/models/user';

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let addressService: jest.Mocked<AddressService>;

  const mockUserRepository = {
    createUser: jest.fn(),
    loginUser: jest.fn(),
    getUserProfile: jest.fn(),
    updatePartialProfile: jest.fn(),
    resendVerificationEmail: jest.fn(),
    createProfile: jest.fn(),
    EditUserProfile: jest.fn(),
    deleteUser: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
    updateUser: jest.fn(),
    addFavoriteVendor: jest.fn(),
    removeFavoriteVendor: jest.fn(),
    addAdresss: jest.fn(),
  };

  const mockAddressService = {
    createAddress: jest.fn(),
    findAllAddressByUserID: jest.fn(),
    UpdateAddress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: AddressService,
          useValue: mockAddressService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get('UserRepository');
    addressService = module.get<AddressService>(AddressService);

    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      const command = new CreateUserCommand(
        'test@example.com',
        'password123',
        'John',
        'Doe',
      );

      const mockResponse = {
        user: { id: 'uuid-123', email: 'test@example.com' },
        session: { access_token: 'token-123' },
      };

      mockUserRepository.createUser.mockResolvedValue(mockResponse);

      const result = await service.createUser(command);

      expect(result).toEqual(mockResponse);
      expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(
        expect.any(User),
      );
    });

    it('should throw BadRequestException when email is missing', async () => {
      const command = new CreateUserCommand('', 'password123', 'John', 'Doe');

      await expect(service.createUser(command)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createUser(command)).rejects.toThrow(
        'Falta algun dato (email, contraseña, nombre o apellido).',
      );
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when password is missing', async () => {
      const command = new CreateUserCommand('test@example.com', '', 'John', 'Doe');

      await expect(service.createUser(command)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when first_name is missing', async () => {
      const command = new CreateUserCommand(
        'test@example.com',
        'password123',
        '',
        'Doe',
      );

      await expect(service.createUser(command)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when last_name is missing', async () => {
      const command = new CreateUserCommand(
        'test@example.com',
        'password123',
        'John',
        '',
      );

      await expect(service.createUser(command)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const command = new CreateUserCommand(
        'test@example.com',
        'password123',
        'John',
        'Doe',
      );

      mockUserRepository.createUser.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.createUser(command)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('loginUser', () => {
    it('should login a user with valid credentials', async () => {
      const command = new LoginUserCommand('test@example.com', 'password123');

      const mockResponse = {
        user: { id: 'uuid-123', email: 'test@example.com' },
        session: { access_token: 'token-123' },
      };

      mockUserRepository.loginUser.mockResolvedValue(mockResponse);

      const result = await service.loginUser(command);

      expect(result).toEqual(mockResponse);
      expect(mockUserRepository.loginUser).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.loginUser).toHaveBeenCalledWith(
        expect.any(User),
      );
    });

    it('should create User object with only email and password for login', async () => {
      const command = new LoginUserCommand('test@example.com', 'password123');

      mockUserRepository.loginUser.mockResolvedValue({
        user: { id: 'uuid-123' },
        session: { access_token: 'token' },
      });

      await service.loginUser(command);

      const calledUser = mockUserRepository.loginUser.mock.calls[0][0];
      expect(calledUser.getEmail()).toBe('test@example.com');
      expect(calledUser.getPassword()).toBe('password123');
    });

    it('should propagate login errors from repository', async () => {
      const command = new LoginUserCommand('test@example.com', 'wrongpassword');

      mockUserRepository.loginUser.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(service.loginUser(command)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('resendVerificationEmail', () => {
    it('should resend verification email successfully', async () => {
      const email = 'test@example.com';
      const mockResponse = { messageId: 'msg-123' };

      mockUserRepository.resendVerificationEmail.mockResolvedValue(
        mockResponse,
      );

      const result = await service.resendVerificationEmail(email);

      expect(result).toEqual(mockResponse);
      expect(mockUserRepository.resendVerificationEmail).toHaveBeenCalledWith(
        email,
      );
    });

    it('should propagate errors when resending email fails', async () => {
      const email = 'test@example.com';

      mockUserRepository.resendVerificationEmail.mockRejectedValue(
        new Error('Email service error'),
      );

      await expect(service.resendVerificationEmail(email)).rejects.toThrow(
        'Email service error',
      );
    });
  });

  describe('getUserProfile', () => {
    it('should get user profile with valid user_id', async () => {
      const userId = 'uuid-123';
      const mockProfile = {
        id: 1,
        user_id: userId,
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
      };

      mockUserRepository.getUserProfile.mockResolvedValue(mockProfile);

      const result = await service.getUserProfile(userId);

      expect(result).toEqual(mockProfile);
      expect(mockUserRepository.getUserProfile).toHaveBeenCalledWith(userId);
    });

    it('should throw BadRequestException when user_id is not provided', async () => {
      await expect(service.getUserProfile('')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.getUserProfile('')).rejects.toThrow(
        'Se requiere el ID del usuario',
      );
    });

    it('should throw BadRequestException when user_id is null', async () => {
      await expect(service.getUserProfile(null as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should propagate repository errors', async () => {
      mockUserRepository.getUserProfile.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(service.getUserProfile('uuid-123')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('EditUserInfo', () => {
    it('should update user info with all fields', async () => {
      const command = new PatchUserCommand(
        'uuid-123',
        'Jane',
        'Smith',
        'jane@example.com',
        1234567890,
      );

      const mockUpdatedUser = {
        id: 1,
        user_id: 'uuid-123',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone_number: 1234567890,
      };

      mockUserRepository.updatePartialProfile.mockResolvedValue(
        mockUpdatedUser,
      );

      const result = await service.EditUserInfo(command);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockUserRepository.updatePartialProfile).toHaveBeenCalledWith(
        'uuid-123',
        {
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          phone_number: 1234567890,
        },
      );
    });

    it('should update user info with partial fields (only first_name)', async () => {
      const command = new PatchUserCommand('uuid-123', 'Jane');

      const mockUpdatedUser = {
        id: 1,
        user_id: 'uuid-123',
        first_name: 'Jane',
      };

      mockUserRepository.updatePartialProfile.mockResolvedValue(
        mockUpdatedUser,
      );

      await service.EditUserInfo(command);

      expect(mockUserRepository.updatePartialProfile).toHaveBeenCalledWith(
        'uuid-123',
        { first_name: 'Jane' },
      );
    });

    it('should update user info with partial fields (email and phone)', async () => {
      const command = new PatchUserCommand(
        'uuid-123',
        undefined,
        undefined,
        'newemail@example.com',
        9876543210,
      );

      mockUserRepository.updatePartialProfile.mockResolvedValue({});

      await service.EditUserInfo(command);

      expect(mockUserRepository.updatePartialProfile).toHaveBeenCalledWith(
        'uuid-123',
        {
          email: 'newemail@example.com',
          phone_number: 9876543210,
        },
      );
    });

    it('should handle errors and wrap them in Error with message', async () => {
      const command = new PatchUserCommand('uuid-123', 'Jane');

      mockUserRepository.updatePartialProfile.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(service.EditUserInfo(command)).rejects.toThrow(
        'Error al actualizar el usuario: Database connection failed',
      );
    });
  });

  describe('getUserWithAddresses', () => {
    it('should get user profile with addresses', async () => {
      const userId = 'uuid-123';
      const mockProfile = {
        id: 1,
        user_id: userId,
        first_name: 'John',
        last_name: 'Doe',
      };
      const mockAddresses = [
        { id: 1, street_address: '123 Main St', city: 'Springfield' },
        { id: 2, street_address: '456 Oak Ave', city: 'Shelbyville' },
      ];

      mockUserRepository.getUserProfile.mockResolvedValue(mockProfile);
      mockAddressService.findAllAddressByUserID.mockResolvedValue(
        mockAddresses,
      );

      const result = await service.getUserWithAddresses(userId);

      expect(result).toEqual({
        ...mockProfile,
        addresses: mockAddresses,
      });
      expect(mockUserRepository.getUserProfile).toHaveBeenCalledWith(userId);
      expect(mockAddressService.findAllAddressByUserID).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should throw BadRequestException when user_id is not provided', async () => {
      await expect(service.getUserWithAddresses('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should call both services in parallel using Promise.all', async () => {
      const userId = 'uuid-123';

      mockUserRepository.getUserProfile.mockResolvedValue({ id: 1 });
      mockAddressService.findAllAddressByUserID.mockResolvedValue([]);

      await service.getUserWithAddresses(userId);

      // Verificar que ambos se llamaron
      expect(mockUserRepository.getUserProfile).toHaveBeenCalled();
      expect(mockAddressService.findAllAddressByUserID).toHaveBeenCalled();
    });

    it('should handle case when user has no addresses', async () => {
      const userId = 'uuid-123';
      const mockProfile = { id: 1, user_id: userId };

      mockUserRepository.getUserProfile.mockResolvedValue(mockProfile);
      mockAddressService.findAllAddressByUserID.mockResolvedValue([]);

      const result = await service.getUserWithAddresses(userId);

      expect(result).toEqual({
        ...mockProfile,
        addresses: [],
      });
    });
  });
});

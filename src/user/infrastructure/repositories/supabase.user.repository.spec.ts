import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SupabaseUserRepository } from './supabase.user.repository';
import User from '../../domain/models/user';
import { createMockSupabaseClient } from '../../../../test/mocks/supabase.mock';

describe('SupabaseUserRepository', () => {
  let repository: SupabaseUserRepository;
  let mockSupabaseClient: any;

  beforeEach(async () => {
    mockSupabaseClient = createMockSupabaseClient();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseUserRepository,
        {
          provide: 'SUPABASE_CLIENT',
          useValue: mockSupabaseClient,
        },
      ],
    }).compile();

    repository = module.get<SupabaseUserRepository>(SupabaseUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const user = new User(
        'test@example.com',
        'password123',
        'John',
        'Doe',
      );

      const mockSignUpResponse = {
        data: {
          user: { id: 'uuid-123', email: 'test@example.com' },
          session: { access_token: 'token-123' },
        },
        error: null,
      };

      const mockInsertResponse = {
        data: { id: 1, user_id: 'uuid-123' },
        error: null,
      };

      mockSupabaseClient.auth.signUp.mockResolvedValue(mockSignUpResponse);
      mockSupabaseClient.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue(mockInsertResponse),
      });

      const result = await repository.createUser(user);

      expect(result).toEqual(mockSignUpResponse.data);
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw error when auth.signUp fails', async () => {
      const user = new User('test@example.com', 'password123', 'John', 'Doe');

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already registered' },
      });

      await expect(repository.createUser(user)).rejects.toThrow(
        'Usuario no creado: Email already registered',
      );
    });

    it('should throw error when user.id is not returned', async () => {
      const user = new User('test@example.com', 'password123', 'John', 'Doe');

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: { id: null }, session: null },
        error: null,
      });

      await expect(repository.createUser(user)).rejects.toThrow(
        'El perfil no se pudo crear',
      );
    });

    it('should call createProfile after successful signUp', async () => {
      const user = new User('test@example.com', 'password123', 'John', 'Doe');

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: {
          user: { id: 'uuid-123' },
          session: {},
        },
        error: null,
      });

      const mockFrom = {
        insert: jest.fn().mockResolvedValue({ data: {}, error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(mockFrom);

      await repository.createUser(user);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('user_profiles');
      expect(mockFrom.insert).toHaveBeenCalledWith({
        user_id: 'uuid-123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'customer',
      });
    });
  });

  describe('createProfile', () => {
    it('should create user profile successfully', async () => {
      const user = new User('test@example.com', 'password', 'John', 'Doe');
      const userId = 'uuid-123';

      const mockFrom = {
        insert: jest.fn().mockResolvedValue({ data: {}, error: null }),
      };
      mockSupabaseClient.from.mockReturnValue(mockFrom);

      const result = await repository.createProfile(user, userId);

      expect(result).toBe(true);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('user_profiles');
      expect(mockFrom.insert).toHaveBeenCalledWith({
        user_id: userId,
        first_name: 'John',
        last_name: 'Doe',
        role: 'customer',
      });
    });

    it('should throw error when profile creation fails', async () => {
      const user = new User('test@example.com', 'password', 'John', 'Doe');
      const userId = 'uuid-123';

      mockSupabaseClient.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      });

      await expect(repository.createProfile(user, userId)).rejects.toThrow(
        'Error al crear perfil: Database error',
      );
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const user = new User('test@example.com', 'password123');

      const mockLoginResponse = {
        data: {
          user: { id: 'uuid-123', email: 'test@example.com' },
          session: { access_token: 'token-123' },
        },
        error: null,
      };

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(
        mockLoginResponse,
      );

      const result = await repository.loginUser(user);

      expect(result).toEqual(mockLoginResponse.data);
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw HttpException when credentials are invalid', async () => {
      const user = new User('test@example.com', 'wrongpassword');

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      await expect(repository.loginUser(user)).rejects.toThrow(HttpException);
      await expect(repository.loginUser(user)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw HttpException with UNAUTHORIZED status', async () => {
      const user = new User('test@example.com', 'wrongpassword');

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' },
      });

      try {
        await repository.loginUser(user);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      const userId = 'uuid-123';
      const mockProfile = {
        id: 1,
        user_id: userId,
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
      };

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.getUserProfile(userId);

      expect(result).toEqual(mockProfile);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('user_profiles');
      expect(mockChain.select).toHaveBeenCalledWith('*');
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', userId);
    });

    it('should throw error when profile not found', async () => {
      const userId = 'uuid-nonexistent';

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'No rows found' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(repository.getUserProfile(userId)).rejects.toThrow(
        'Perfil no encontrado: No rows found',
      );
    });
  });

  describe('resendVerificationEmail', () => {
    it('should resend verification email successfully', async () => {
      const email = 'test@example.com';
      const mockResponse = {
        data: { messageId: 'msg-123' },
        error: null,
      };

      mockSupabaseClient.auth.resend.mockResolvedValue(mockResponse);

      const result = await repository.resendVerificationEmail(email);

      expect(result).toEqual(mockResponse.data);
      expect(mockSupabaseClient.auth.resend).toHaveBeenCalledWith({
        type: 'signup',
        email: email,
      });
    });

    it('should throw HttpException when resend fails', async () => {
      const email = 'test@example.com';

      mockSupabaseClient.auth.resend.mockResolvedValue({
        data: null,
        error: { message: 'Email service unavailable' },
      });

      await expect(repository.resendVerificationEmail(email)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updatePartialProfile', () => {
    it('should update profile with partial data successfully', async () => {
      const userId = 'uuid-123';
      const partialUpdate = {
        first_name: 'Jane',
        phone_number: 1234567890,
      };

      const mockExistingUser = { id: 1, user_id: userId, first_name: 'John' };
      const mockUpdatedUser = { ...mockExistingUser, ...partialUpdate };

      const mockSelectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockExistingUser,
          error: null,
        }),
      };

      const mockUpdateChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUpdatedUser,
          error: null,
        }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockSelectChain)
        .mockReturnValueOnce(mockUpdateChain);

      const result = await repository.updatePartialProfile(userId, partialUpdate);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockUpdateChain.update).toHaveBeenCalledWith(partialUpdate);
    });

    it('should throw error when user not found', async () => {
      const userId = 'uuid-nonexistent';

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(
        repository.updatePartialProfile(userId, { first_name: 'Jane' }),
      ).rejects.toThrow('Error en updatePartial: Usuario no encontrado');
    });

    it('should throw error when update fails', async () => {
      const userId = 'uuid-123';

      const mockSelectChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 1 },
          error: null,
        }),
      };

      const mockUpdateChain = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Update failed' },
        }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockSelectChain)
        .mockReturnValueOnce(mockUpdateChain);

      await expect(
        repository.updatePartialProfile(userId, { first_name: 'Jane' }),
      ).rejects.toThrow('Error en updatePartial: Error actualizando usuario');
    });
  });

  describe('findById', () => {
    it('should find user by id successfully', async () => {
      const userId = 1;
      const mockUser = { id: userId, first_name: 'John' };

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      const result = await repository.findById(userId);

      expect(result).toEqual(mockUser);
      expect(mockChain.eq).toHaveBeenCalledWith('id', userId);
    });

    it('should throw error when user not found by id', async () => {
      const userId = 999;

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockChain);

      await expect(repository.findById(userId)).rejects.toThrow(
        'Usuario no encontrado: Not found',
      );
    });
  });
});

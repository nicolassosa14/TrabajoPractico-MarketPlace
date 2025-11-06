import User from '../../src/user/domain/models/user';
import CreateUserCommand from '../../src/user/service/dto/CreateUser.dto';
import LoginUserCommand from '../../src/user/service/dto/LoginUser.dto';

/**
 * Fixtures para tests del módulo User
 */

export const validUserData = {
  email: 'john.doe@example.com',
  password: 'SecurePassword123!',
  first_name: 'John',
  last_name: 'Doe',
  phone_number: 1234567890,
};

export const validUserData2 = {
  email: 'jane.smith@example.com',
  password: 'AnotherSecurePass456!',
  first_name: 'Jane',
  last_name: 'Smith',
  phone_number: 9876543210,
};

export const invalidUserDataMissingEmail = {
  email: '',
  password: 'SecurePassword123!',
  first_name: 'John',
  last_name: 'Doe',
};

export const invalidUserDataMissingPassword = {
  email: 'john.doe@example.com',
  password: '',
  first_name: 'John',
  last_name: 'Doe',
};

export const invalidUserDataMissingFirstName = {
  email: 'john.doe@example.com',
  password: 'SecurePassword123!',
  first_name: '',
  last_name: 'Doe',
};

export const invalidUserDataMissingLastName = {
  email: 'john.doe@example.com',
  password: 'SecurePassword123!',
  first_name: 'John',
  last_name: '',
};

export const createValidUser = (): User => {
  return new User(
    validUserData.email,
    validUserData.password,
    validUserData.first_name,
    validUserData.last_name,
    validUserData.phone_number,
  );
};

export const createValidUserCommand = (): CreateUserCommand => {
  return new CreateUserCommand(
    validUserData.email,
    validUserData.password,
    validUserData.first_name,
    validUserData.last_name,
  );
};

export const createValidLoginCommand = (): LoginUserCommand => {
  return new LoginUserCommand(validUserData.email, validUserData.password);
};

export const mockUserUUID = '123e4567-e89b-12d3-a456-426614174000';

export const mockUserProfile = {
  id: 1,
  user_id: mockUserUUID,
  first_name: validUserData.first_name,
  last_name: validUserData.last_name,
  email: validUserData.email,
  phone_number: validUserData.phone_number,
  role: 'customer',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockAuthResponse = {
  user: {
    id: mockUserUUID,
    email: validUserData.email,
    created_at: new Date().toISOString(),
  },
  session: {
    access_token: 'mock-access-token-12345',
    refresh_token: 'mock-refresh-token-12345',
    expires_in: 3600,
  },
};

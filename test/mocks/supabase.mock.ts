/**
 * Mock completo del cliente de Supabase para testing
 */

export const createMockSupabaseClient = () => {
  const mockAuth = {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    resend: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
  };

  const mockFrom = jest.fn(() => ({
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    neq: jest.fn().mockReturnThis(),
  }));

  return {
    auth: mockAuth,
    from: mockFrom,
  };
};

/**
 * Mock de respuesta exitosa de signUp
 */
export const mockSignUpSuccess = {
  data: {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      created_at: new Date().toISOString(),
    },
    session: {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
    },
  },
  error: null,
};

/**
 * Mock de respuesta de error de signUp (email ya existe)
 */
export const mockSignUpError = {
  data: { user: null, session: null },
  error: {
    message: 'User already registered',
    status: 400,
  },
};

/**
 * Mock de respuesta exitosa de signIn
 */
export const mockSignInSuccess = {
  data: {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
    },
    session: {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
    },
  },
  error: null,
};

/**
 * Mock de respuesta de error de signIn (credenciales inválidas)
 */
export const mockSignInError = {
  data: { user: null, session: null },
  error: {
    message: 'Invalid login credentials',
    status: 401,
  },
};

/**
 * Mock de respuesta exitosa de insert en user_profiles
 */
export const mockInsertProfileSuccess = {
  data: {
    id: 1,
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    first_name: 'John',
    last_name: 'Doe',
    role: 'customer',
  },
  error: null,
};

/**
 * Mock de respuesta exitosa de select user_profile
 */
export const mockSelectProfileSuccess = {
  data: {
    id: 1,
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    first_name: 'John',
    last_name: 'Doe',
    email: 'test@example.com',
    phone_number: null,
    role: 'customer',
    created_at: new Date().toISOString(),
  },
  error: null,
};

/**
 * Mock de respuesta de error de select (no encontrado)
 */
export const mockSelectProfileError = {
  data: null,
  error: {
    message: 'No rows found',
    status: 404,
  },
};

/**
 * Mock de respuesta exitosa de update
 */
export const mockUpdateProfileSuccess = {
  data: {
    id: 1,
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'updated@example.com',
    phone_number: 1234567890,
    role: 'customer',
  },
  error: null,
};

/**
 * Mock de respuesta exitosa de insert address
 */
export const mockInsertAddressSuccess = {
  data: {
    id: 1,
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    street_address: '123 Main St',
    city: 'Springfield',
    postal_code: '12345',
    details: 'Apt 4B',
  },
  error: null,
};

/**
 * Mock de respuesta exitosa de select addresses
 */
export const mockSelectAddressesSuccess = {
  data: [
    {
      id: 1,
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      street_address: '123 Main St',
      city: 'Springfield',
      postal_code: '12345',
      details: 'Apt 4B',
    },
    {
      id: 2,
      user_id: '123e4567-e89b-12d3-a456-426614174000',
      street_address: '456 Oak Ave',
      city: 'Springfield',
      postal_code: '12346',
      details: null,
    },
  ],
  error: null,
};

/**
 * Mock de respuesta exitosa de resend email
 */
export const mockResendEmailSuccess = {
  data: {
    messageId: 'mock-message-id',
  },
  error: null,
};

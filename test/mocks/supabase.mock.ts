/**
 * Mock completo de Supabase Client para tests
 * Implementación funcional que simula una base de datos en memoria
 */

// Generar UUID v4 sin dependencias externas
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Simulación de datos en memoria
class InMemoryDatabase {
  private users: Map<string, any> = new Map();
  private userProfiles: Map<string, any> = new Map();
  private addresses: Map<string, any> = new Map();
  private vendors: Map<string, any> = new Map();
  private categories: Map<string, any> = new Map();
  private products: Map<string, any> = new Map();
  private productCategories: Map<string, any> = new Map();
  private orders: Map<string, any> = new Map();
  private orderItems: Map<string, any> = new Map();
  private payments: Map<string, any> = new Map();
  private deliveries: Map<string, any> = new Map();
  private reviews: Map<string, any> = new Map();
  private favoriteVendors: Map<string, any> = new Map();

  getTable(tableName: string): Map<string, any> {
    const tables: { [key: string]: Map<string, any> } = {
      users: this.users,
      user_profiles: this.userProfiles,
      addresses: this.addresses,
      vendors: this.vendors,
      categories: this.categories,
      products: this.products,
      product_categories: this.productCategories,
      orders: this.orders,
      order_items: this.orderItems,
      payments: this.payments,
      deliveries: this.deliveries,
      reviews: this.reviews,
      user_favorite_vendors: this.favoriteVendors,
    };
    return tables[tableName] || new Map();
  }

  async insert(tableName: string, data: any): Promise<{ data: any; error: any }> {
    try {
      const table = this.getTable(tableName);
      const id = data.id || uuidv4();
      const record = { 
        ...data, 
        id, 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
      };
      
      // Verificar duplicados para addresses
      if (tableName === 'addresses') {
        const existing = Array.from(table.values()).find(
          (addr) =>
            addr.user_id === record.user_id &&
            addr.street_address === record.street_address &&
            addr.city === record.city &&
            addr.postal_code === record.postal_code
        );
        if (existing) {
          throw new Error('Ya existe esta direccion para este usuario');
        }
      }
      
      table.set(id, record);
      return { data: record, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  async select(tableName: string, filters?: any): Promise<any[]> {
    const table = this.getTable(tableName);
    let results = Array.from(table.values());

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        results = results.filter((item) => item[key] === value);
      }
    }

    return results;
  }

  async selectOne(tableName: string, filters: any): Promise<any> {
    const results = await this.select(tableName, filters);
    return results[0] || null;
  }

  async update(
    tableName: string,
    data: any,
    filters: any,
  ): Promise<{ data: any; error: any }> {
    try {
      const table = this.getTable(tableName);
      const results = await this.select(tableName, filters);

      if (results.length === 0) {
        return { data: null, error: { message: 'No rows found' } };
      }

      const updated = results.map((item) => ({
        ...item,
        ...data,
        updated_at: new Date().toISOString(),
      }));

      updated.forEach((item) => table.set(item.id, item));

      return { data: updated.length === 1 ? updated[0] : updated, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  async delete(tableName: string, filters: any): Promise<{ error: any }> {
    try {
      const table = this.getTable(tableName);
      const results = await this.select(tableName, filters);

      results.forEach((item) => table.delete(item.id));

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  }

  async signUp(email: string, password: string): Promise<{ id: string }> {
    // Verificar si el email ya existe
    const existingUsers = Array.from(this.users.values()).filter(u => u.email === email);
    if (existingUsers.length > 0) {
      throw new Error('User already registered');
    }

    const id = uuidv4();
    this.users.set(id, {
      id,
      email,
      password,
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
    return { id };
  }

  async signIn(email: string, password: string): Promise<any> {
    const users = await this.select('users', { email });

    if (users.length === 0) {
      throw new Error('Invalid login credentials');
    }

    const user = users[0];
    if (user.password !== password) {
      throw new Error('Invalid login credentials');
    }

    return {
      user: { id: user.id, email: user.email },
      session: {
        access_token: `mock_token_${user.id}`,
        refresh_token: `mock_refresh_${user.id}`,
      },
    };
  }

  clear(): void {
    this.users.clear();
    this.userProfiles.clear();
    this.addresses.clear();
    this.vendors.clear();
    this.categories.clear();
    this.products.clear();
    this.productCategories.clear();
    this.orders.clear();
    this.orderItems.clear();
    this.payments.clear();
    this.deliveries.clear();
    this.reviews.clear();
    this.favoriteVendors.clear();
  }
}

// Singleton instance compartida globalmente
let globalDatabase: InMemoryDatabase | null = null;

function getGlobalDatabase(): InMemoryDatabase {
  if (!globalDatabase) {
    globalDatabase = new InMemoryDatabase();
  }
  return globalDatabase;
}

export const createMockSupabaseClient = () => {
  const database = getGlobalDatabase();
  return {
    auth: {
      signUp: jest.fn(async (options: { email: string; password: string }) => {
        try {
          const { id } = await database.signUp(options.email, options.password);
          return {
            data: {
              user: { id, email: options.email },
              session: {
                access_token: `mock_token_${id}`,
                refresh_token: `mock_refresh_${id}`,
              },
            },
            error: null,
          };
        } catch (error: any) {
          return {
            data: null,
            error: { message: error.message },
          };
        }
      }),

      signInWithPassword: jest.fn(async (options: { email: string; password: string }) => {
        try {
          const result = await database.signIn(options.email, options.password);
          return {
            data: result,
            error: null,
          };
        } catch (error: any) {
          return {
            data: null,
            error: { message: error.message },
          };
        }
      }),

      resend: jest.fn(async (options: { type: string; email: string }) => {
        return {
          data: { messageId: 'mock-message-id' },
          error: null,
        };
      }),
    },

    from: jest.fn((tableName: string) => ({
      insert: jest.fn(async (data: any | any[]) => {
        if (Array.isArray(data)) {
          const results = [];
          for (const record of data) {
            const result = await database.insert(tableName, record);
            if (result.error) return result;
            results.push(result.data);
          }
          return { data: results, error: null };
        } else {
          return await database.insert(tableName, data);
        }
      }),

      select: jest.fn((columns?: string) => ({
        eq: jest.fn((column: string, value: any) => ({
          single: jest.fn(async () => {
            const results = await database.select(tableName, { [column]: value });
            if (results.length === 0) {
              return {
                data: null,
                error: { message: 'No rows found' },
              };
            }
            return {
              data: results[0],
              error: null,
            };
          }),
          then: jest.fn(async () => {
            const results = await database.select(tableName, { [column]: value });
            return {
              data: results,
              error: null,
            };
          }),
        })),
        then: jest.fn(async () => {
          const results = await database.select(tableName);
          return {
            data: results,
            error: null,
          };
        }),
      })),

      update: jest.fn((data: any) => ({
        eq: jest.fn((column: string, value: any) => ({
          select: jest.fn(() => ({
            single: jest.fn(async () => {
              const result = await database.update(tableName, data, { [column]: value });
              return {
                data: result.data,
                error: result.error,
              };
            }),
          })),
        })),
      })),

      delete: jest.fn(() => ({
        eq: jest.fn((column: string, value: any) => ({
          then: jest.fn(async () => {
            return await database.delete(tableName, { [column]: value });
          }),
        })),
        neq: jest.fn((column: string, value: any) => ({
          then: jest.fn(async () => {
            // Para neq, seleccionamos todos excepto los que coincidan
            const table = database.getTable(tableName);
            const toDelete = Array.from(table.values()).filter(
              (item) => item[column] !== value
            );
            toDelete.forEach((item) => table.delete(item.id));
            return { error: null };
          }),
        })),
      })),
    })),

    // Método para limpiar datos entre tests
    _clearDatabase: () => {
      database.clear();
    },

    // Método para acceder a la base de datos (para debugging)
    _getDatabase: () => database,
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
    first_name: 'Pepe',
    last_name: 'Perez',
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
    first_name: 'Pepe',
    last_name: 'Perez',
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
    last_name: 'Perez',
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

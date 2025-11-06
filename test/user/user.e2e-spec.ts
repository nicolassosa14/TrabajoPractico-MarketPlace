import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '../../src/user/user.module';
import { SupabaseModule } from '../../src/supabase/supabase.module';
import { AddressModule } from '../../src/address/address.module';
import { generateTestEmail } from '../helpers/test.helper';

describe('User Module (E2E)', () => {
  let app: INestApplication;
  let createdUserId: string;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SupabaseModule, UserModule, AddressModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Aplicar pipes de validación como en la app real
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST) - Create User', () => {
    it('should create a new user with valid data', () => {
      const testEmail = generateTestEmail();

      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: testEmail,
          password: 'TestPassword123!',
          first_name: 'John',
          last_name: 'Doe',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('user');
          expect(response.body.user).toHaveProperty('id');
          expect(response.body.user.email).toBe(testEmail);

          // Guardar para tests posteriores
          createdUserId = response.body.user.id;
        });
    });

    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          password: 'TestPassword123!',
          first_name: 'John',
          last_name: 'Doe',
        })
        .expect(400);
    });

    it('should return 400 when password is missing', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          first_name: 'John',
          last_name: 'Doe',
        })
        .expect(400);
    });

    it('should return 400 when first_name is missing', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'TestPassword123!',
          last_name: 'Doe',
        })
        .expect(400);
    });

    it('should return 400 when last_name is missing', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'TestPassword123!',
          first_name: 'John',
        })
        .expect(400);
    });

    it('should return error when email already exists', () => {
      const duplicateEmail = generateTestEmail();

      // Primer registro
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: duplicateEmail,
          password: 'TestPassword123!',
          first_name: 'John',
          last_name: 'Doe',
        })
        .expect(201)
        .then(() => {
          // Intento de duplicado
          return request(app.getHttpServer())
            .post('/users')
            .send({
              email: duplicateEmail,
              password: 'AnotherPassword456!',
              first_name: 'Jane',
              last_name: 'Smith',
            })
            .expect(500); // Supabase retorna error de duplicado
        });
    });
  });

  describe('/users/login (POST) - Login User', () => {
    const loginEmail = generateTestEmail();
    const loginPassword = 'LoginPassword123!';

    beforeAll(async () => {
      // Crear usuario para login
      await request(app.getHttpServer()).post('/users').send({
        email: loginEmail,
        password: loginPassword,
        first_name: 'Login',
        last_name: 'Test',
      });
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: loginEmail,
          password: loginPassword,
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('session');
          expect(response.body.session).toHaveProperty('access_token');

          accessToken = response.body.session.access_token;
        });
    });

    it('should return 401 with invalid password', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: loginEmail,
          password: 'WrongPassword123!',
        })
        .expect(401);
    });

    it('should return 401 with non-existent email', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123!',
        })
        .expect(401);
    });

    it('should return 400 when email is missing', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          password: 'SomePassword123!',
        })
        .expect(400);
    });

    it('should return 400 when password is missing', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: loginEmail,
        })
        .expect(400);
    });
  });

  describe('/users/profile (GET) - Get User Profile', () => {
    let testUserId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        email: generateTestEmail(),
        password: 'ProfileTest123!',
        first_name: 'Profile',
        last_name: 'User',
      });

      testUserId = response.body.user.id;
    });

    it('should get user profile with valid user_id', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .send(testUserId)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('user_id');
          expect(response.body).toHaveProperty('first_name');
          expect(response.body).toHaveProperty('last_name');
          expect(response.body.first_name).toBe('Profile');
          expect(response.body.last_name).toBe('User');
        });
    });

    it('should return 400 when user_id is not provided', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .send('')
        .expect(400);
    });

    it('should return error with non-existent user_id', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .send('00000000-0000-0000-0000-000000000000')
        .expect(500); // Error de Supabase
    });
  });

  describe('/users/profile (PATCH) - Update User Profile', () => {
    let testUserId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        email: generateTestEmail(),
        password: 'UpdateTest123!',
        first_name: 'Original',
        last_name: 'Name',
      });

      testUserId = response.body.user.id;
    });

    it('should update all fields successfully', () => {
      return request(app.getHttpServer())
        .patch('/users/profile')
        .send({
          user_id: testUserId,
          email: generateTestEmail(),
          first_name: 'Updated',
          last_name: 'User',
          phone_number: 1234567890,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.first_name).toBe('Updated');
          expect(response.body.last_name).toBe('User');
          expect(response.body.phone_number).toBe(1234567890);
        });
    });

    it('should update only first_name', () => {
      return request(app.getHttpServer())
        .patch('/users/profile')
        .send({
          user_id: testUserId,
          first_name: 'PartialUpdate',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.first_name).toBe('PartialUpdate');
        });
    });

    it('should update only phone_number', () => {
      return request(app.getHttpServer())
        .patch('/users/profile')
        .send({
          user_id: testUserId,
          phone_number: 9876543210,
        })
        .expect(200)
        .then((response) => {
          expect(response.body.phone_number).toBe(9876543210);
        });
    });

    it('should return 400 when user_id is missing', () => {
      return request(app.getHttpServer())
        .patch('/users/profile')
        .send({
          first_name: 'Test',
        })
        .expect(400);
    });
  });

  describe('/users/profile-with-addresses (GET) - Get Profile With Addresses', () => {
    let testUserId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        email: generateTestEmail(),
        password: 'AddressTest123!',
        first_name: 'Address',
        last_name: 'User',
      });

      testUserId = response.body.user.id;

      // Crear una dirección para este usuario
      await request(app.getHttpServer()).post('/address').send({
        user_id: testUserId,
        street_address: '123 Test Street',
        city: 'Test City',
        postal_code: '12345',
        details: 'Test details',
      });
    });

    it('should get user profile with addresses', () => {
      return request(app.getHttpServer())
        .get('/users/profile-with-addresses')
        .send({ user_id: testUserId })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('user_id');
          expect(response.body).toHaveProperty('addresses');
          expect(Array.isArray(response.body.addresses)).toBe(true);
          expect(response.body.addresses.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/users/resend-email/:email (POST) - Resend Verification Email', () => {
    it('should resend verification email for valid email', () => {
      const email = generateTestEmail();

      // Primero crear el usuario
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: email,
          password: 'ResendTest123!',
          first_name: 'Resend',
          last_name: 'Test',
        })
        .then(() => {
          // Luego intentar reenviar el email
          return request(app.getHttpServer())
            .post(`/users/resend-email/${email}`)
            .expect(201);
        });
    });

    it('should handle request for non-existent email', () => {
      return request(app.getHttpServer())
        .post('/users/resend-email/nonexistent@example.com')
        .expect(401); // Supabase retorna unauthorized para emails no encontrados
    });
  });
});

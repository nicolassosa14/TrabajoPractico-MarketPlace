import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AddressModule } from '../../src/address/address.module';
import { SupabaseModule } from '../../src/supabase/supabase.module';
import { UserModule } from '../../src/user/user.module';
import { generateTestEmail } from '../helpers/test.helper';

describe('Address Module (E2E)', () => {
  let app: INestApplication;
  let testUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SupabaseModule, AddressModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Crear un usuario de prueba para usar en los tests de direcciones
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: generateTestEmail(),
        password: 'AddressTestUser123!',
        first_name: 'Address',
        last_name: 'Tester',
      });

    testUserId = userResponse.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/address (POST) - Create Address', () => {
    it('should create a new address with all fields', () => {
      return request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: testUserId,
          street_address: '123 Main Street',
          city: 'Springfield',
          postal_code: '12345',
          details: 'Apartment 4B, Ring doorbell twice',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toContain('Dirección creada con éxito');
        });
    });

    it('should create a new address without optional details', () => {
      return request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: testUserId,
          street_address: '456 Oak Avenue',
          city: 'Shelbyville',
          postal_code: '67890',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toContain('Dirección creada con éxito');
        });
    });

    it('should return 400 when trying to create duplicate address', () => {
      const duplicateAddress = {
        user_id: testUserId,
        street_address: '789 Duplicate Street',
        city: 'TestCity',
        postal_code: '99999',
      };

      // Primera creación
      return request(app.getHttpServer())
        .post('/address')
        .send(duplicateAddress)
        .expect(201)
        .then(() => {
          // Intento de duplicado
          return request(app.getHttpServer())
            .post('/address')
            .send(duplicateAddress)
            .expect(400)
            .then((response) => {
              expect(response.body.message).toContain(
                'Ya existe esta direccion para este usuario',
              );
            });
        });
    });

    it('should return 400 when user_id is missing', () => {
      return request(app.getHttpServer())
        .post('/address')
        .send({
          street_address: '123 Main Street',
          city: 'Springfield',
          postal_code: '12345',
        })
        .expect(400);
    });

    it('should return 400 when street_address is missing', () => {
      return request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: testUserId,
          city: 'Springfield',
          postal_code: '12345',
        })
        .expect(400);
    });

    it('should return 400 when city is missing', () => {
      return request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: testUserId,
          street_address: '123 Main Street',
          postal_code: '12345',
        })
        .expect(400);
    });

    it('should return 400 when postal_code is missing', () => {
      return request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: testUserId,
          street_address: '123 Main Street',
          city: 'Springfield',
        })
        .expect(400);
    });

    it('should handle special characters in address fields', () => {
      return request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: testUserId,
          street_address: "123 O'Brien St, Apt #4B",
          city: "St. John's",
          postal_code: 'A1B 2C3',
          details: 'Notes: Use back entrance & ring twice!',
        })
        .expect(201);
    });
  });

  describe('/address (GET) - Find All Addresses By User ID', () => {
    let userWithAddresses: string;

    beforeAll(async () => {
      // Crear un nuevo usuario
      const userResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'MultiAddress123!',
          first_name: 'Multi',
          last_name: 'Address',
        });

      userWithAddresses = userResponse.body.user.id;

      // Crear múltiples direcciones para este usuario
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userWithAddresses,
          street_address: '111 First Street',
          city: 'City1',
          postal_code: '11111',
          details: 'First address',
        });

      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userWithAddresses,
          street_address: '222 Second Street',
          city: 'City2',
          postal_code: '22222',
          details: 'Second address',
        });

      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userWithAddresses,
          street_address: '333 Third Street',
          city: 'City3',
          postal_code: '33333',
        });
    });

    it('should get all addresses for a user', () => {
      return request(app.getHttpServer())
        .get('/address')
        .send(userWithAddresses)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThanOrEqual(3);

          // Verificar que todas las direcciones pertenecen al usuario correcto
          response.body.forEach((address: any) => {
            expect(address.user_id).toBe(userWithAddresses);
          });
        });
    });

    it('should return empty array for user with no addresses', async () => {
      // Crear un nuevo usuario sin direcciones
      const newUserResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'NoAddress123!',
          first_name: 'No',
          last_name: 'Address',
        });

      const newUserId = newUserResponse.body.user.id;

      return request(app.getHttpServer())
        .get('/address')
        .send(newUserId)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(0);
        });
    });

    it('should return error for invalid user_id format', () => {
      return request(app.getHttpServer())
        .get('/address')
        .send('invalid-uuid-format')
        .expect(400);
    });
  });

  describe('/address (PATCH) - Update Address', () => {
    let userForUpdate: string;
    let addressId: string;

    beforeAll(async () => {
      // Crear usuario
      const userResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'UpdateAddress123!',
          first_name: 'Update',
          last_name: 'Test',
        });

      userForUpdate = userResponse.body.user.id;

      // Crear una dirección para actualizar
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userForUpdate,
          street_address: '999 Original Street',
          city: 'Original City',
          postal_code: '99999',
          details: 'Original details',
        });

      // Obtener el ID de la dirección creada
      const addressesResponse = await request(app.getHttpServer())
        .get('/address')
        .send(userForUpdate);

      addressId = addressesResponse.body[0].id;
    });

    it('should update address successfully', () => {
      return request(app.getHttpServer())
        .patch('/address')
        .send({
          user_id: addressId,
          street_address: '999 Updated Street',
          city: 'Updated City',
          postal_code: '88888',
          details: 'Updated details',
        })
        .expect(200);
      // Nota: Actualmente UpdateAddress no está implementado,
      // este test fallará hasta que se implemente
    });

    it('should handle partial address update', () => {
      return request(app.getHttpServer())
        .patch('/address')
        .send({
          user_id: addressId,
          city: 'New City Only',
        })
        .expect(200);
    });

    it.skip('should return error when address_id does not exist', () => {
      return request(app.getHttpServer())
        .patch('/address')
        .send({
          user_id: 'non-existent-id',
          city: 'New City',
        })
        .expect(400);
    });
  });

  describe('Address Integration with User', () => {
    it('should create user and multiple addresses in sequence', async () => {
      // 1. Crear usuario
      const userResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'Integration123!',
          first_name: 'Integration',
          last_name: 'Test',
        })
        .expect(201);

      const userId = userResponse.body.user.id;
      expect(userId).toBeDefined();

      // 2. Crear primera dirección
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userId,
          street_address: '100 Home Street',
          city: 'Home City',
          postal_code: '10000',
          details: 'Home address',
        })
        .expect(201);

      // 3. Crear segunda dirección
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userId,
          street_address: '200 Work Street',
          city: 'Work City',
          postal_code: '20000',
          details: 'Work address',
        })
        .expect(201);

      // 4. Verificar que el usuario tiene 2 direcciones
      const addressesResponse = await request(app.getHttpServer())
        .get('/address')
        .send(userId)
        .expect(200);

      expect(addressesResponse.body.length).toBe(2);
    });

    it('should prevent creating address for non-existent user', () => {
      return request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: '00000000-0000-0000-0000-000000000000',
          street_address: '123 Fake Street',
          city: 'Fake City',
          postal_code: '00000',
        })
        .expect(500); // Error de foreign key constraint
    });
  });

  describe('Real World Scenarios', () => {
    it('should handle complete user journey: signup -> add home -> add work -> list all', async () => {
      // 1. Usuario se registra
      const signupResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'Journey123!',
          first_name: 'Journey',
          last_name: 'User',
        })
        .expect(201);

      const userId = signupResponse.body.user.id;

      // 2. Agrega dirección de casa
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userId,
          street_address: '742 Evergreen Terrace',
          city: 'Springfield',
          postal_code: '58008',
          details: 'Ring doorbell',
        })
        .expect(201);

      // 3. Agrega dirección de trabajo
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userId,
          street_address: '1060 W Addison St',
          city: 'Chicago',
          postal_code: '60613',
          details: 'Office building, 5th floor',
        })
        .expect(201);

      // 4. Lista todas sus direcciones
      const listResponse = await request(app.getHttpServer())
        .get('/address')
        .send(userId)
        .expect(200);

      expect(listResponse.body.length).toBe(2);
      expect(listResponse.body[0]).toHaveProperty('street_address');
      expect(listResponse.body[0]).toHaveProperty('city');
      expect(listResponse.body[0]).toHaveProperty('postal_code');

      // 5. Obtiene perfil con direcciones
      const profileResponse = await request(app.getHttpServer())
        .get('/users/profile-with-addresses')
        .send({ user_id: userId })
        .expect(200);

      expect(profileResponse.body).toHaveProperty('addresses');
      expect(profileResponse.body.addresses.length).toBe(2);
    });
  });
});

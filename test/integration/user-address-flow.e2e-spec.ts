import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { generateTestEmail } from '../helpers/test.helper';

describe('User-Address Integration Flow (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Complete User Journey with Addresses', () => {
    let userId: string;
    let accessToken: string;
    const userEmail = generateTestEmail();
    const userPassword = 'CompleteFlow123!';

    it('Step 1: User registers successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: userEmail,
          password: userPassword,
          first_name: 'Complete',
          last_name: 'Flow',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');

      userId = response.body.user.id;
    });

    it('Step 2: User logs in and receives access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: userEmail,
          password: userPassword,
        })
        .expect(201);

      expect(response.body).toHaveProperty('session');
      expect(response.body.session).toHaveProperty('access_token');

      accessToken = response.body.session.access_token;
    });

    it('Step 3: User gets their profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/profile')
        .send(userId)
        .expect(200);

      expect(response.body).toHaveProperty('user_id', userId);
      expect(response.body).toHaveProperty('first_name', 'Complete');
      expect(response.body).toHaveProperty('last_name', 'Flow');
    });

    it('Step 4: User adds their home address', async () => {
      const response = await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userId,
          street_address: '742 Evergreen Terrace',
          city: 'Springfield',
          postal_code: '58008',
          details: 'Home address - Ring doorbell twice',
        })
        .expect(201);

      expect(response.body).toContain('Dirección creada con éxito');
    });

    it('Step 5: User adds their work address', async () => {
      const response = await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userId,
          street_address: '1000 Corporate Blvd',
          city: 'Springfield',
          postal_code: '58009',
          details: 'Work - Office 301',
        })
        .expect(201);

      expect(response.body).toContain('Dirección creada con éxito');
    });

    it('Step 6: User adds vacation home address', async () => {
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userId,
          street_address: '5000 Beach Road',
          city: 'Coastal Town',
          postal_code: '90210',
          details: 'Summer house - Key under mat',
        })
        .expect(201);
    });

    it('Step 7: User retrieves all their addresses', async () => {
      const response = await request(app.getHttpServer())
        .get('/address')
        .send(userId)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);

      // Verificar que todas las direcciones pertenecen al usuario
      response.body.forEach((address: any) => {
        expect(address.user_id).toBe(userId);
        expect(address).toHaveProperty('street_address');
        expect(address).toHaveProperty('city');
        expect(address).toHaveProperty('postal_code');
      });

      // Verificar direcciones específicas
      const addresses = response.body.map((a: any) => a.street_address);
      expect(addresses).toContain('742 Evergreen Terrace');
      expect(addresses).toContain('1000 Corporate Blvd');
      expect(addresses).toContain('5000 Beach Road');
    });

    it('Step 8: User updates their profile information', async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/profile')
        .send({
          user_id: userId,
          phone_number: 5551234567,
          first_name: 'Updated',
        })
        .expect(200);

      expect(response.body).toHaveProperty('first_name', 'Updated');
      expect(response.body).toHaveProperty('phone_number', 5551234567);
      expect(response.body).toHaveProperty('last_name', 'Flow'); // No cambió
    });

    it('Step 9: User gets profile with all addresses in one call', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/profile-with-addresses')
        .send({ user_id: userId })
        .expect(200);

      expect(response.body).toHaveProperty('user_id', userId);
      expect(response.body).toHaveProperty('first_name', 'Updated');
      expect(response.body).toHaveProperty('addresses');
      expect(Array.isArray(response.body.addresses)).toBe(true);
      expect(response.body.addresses.length).toBe(3);
    });
  });

  describe('Multi-User Address Isolation', () => {
    it('should ensure users can only see their own addresses', async () => {
      // Crear Usuario 1
      const user1Response = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'User1Pass123!',
          first_name: 'User',
          last_name: 'One',
        });

      const user1Id = user1Response.body.user.id;

      // Crear Usuario 2
      const user2Response = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'User2Pass123!',
          first_name: 'User',
          last_name: 'Two',
        });

      const user2Id = user2Response.body.user.id;

      // Usuario 1 agrega dirección
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: user1Id,
          street_address: 'User1 Street',
          city: 'City1',
          postal_code: '11111',
        });

      // Usuario 2 agrega dirección
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: user2Id,
          street_address: 'User2 Street',
          city: 'City2',
          postal_code: '22222',
        });

      // Verificar que Usuario 1 solo ve su dirección
      const user1Addresses = await request(app.getHttpServer())
        .get('/address')
        .send(user1Id);

      expect(user1Addresses.body.length).toBeGreaterThanOrEqual(1);
      user1Addresses.body.forEach((addr: any) => {
        expect(addr.user_id).toBe(user1Id);
        expect(addr.street_address).not.toContain('User2');
      });

      // Verificar que Usuario 2 solo ve su dirección
      const user2Addresses = await request(app.getHttpServer())
        .get('/address')
        .send(user2Id);

      expect(user2Addresses.body.length).toBeGreaterThanOrEqual(1);
      user2Addresses.body.forEach((addr: any) => {
        expect(addr.user_id).toBe(user2Id);
        expect(addr.street_address).not.toContain('User1');
      });
    });
  });

  describe('Error Handling Scenarios', () => {
    it('should handle creating address before user exists (referential integrity)', async () => {
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: '00000000-0000-0000-0000-000000000000',
          street_address: '123 Nonexistent User St',
          city: 'Nowhere',
          postal_code: '00000',
        })
        .expect(500); // Foreign key constraint error
    });

    it('should handle duplicate address for same user', async () => {
      const userResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'Duplicate123!',
          first_name: 'Duplicate',
          last_name: 'Test',
        });

      const userId = userResponse.body.user.id;

      const duplicateAddress = {
        user_id: userId,
        street_address: '999 Duplicate St',
        city: 'DupCity',
        postal_code: '99999',
      };

      // Primera creación exitosa
      await request(app.getHttpServer())
        .post('/address')
        .send(duplicateAddress)
        .expect(201);

      // Segunda creación debe fallar
      await request(app.getHttpServer())
        .post('/address')
        .send(duplicateAddress)
        .expect(400);
    });

    it('should handle invalid user_id format in various operations', async () => {
      // Invalid format en create address
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: 'not-a-uuid',
          street_address: '123 Test',
          city: 'Test',
          postal_code: '12345',
        })
        .expect(400);

      // Invalid format en get addresses
      await request(app.getHttpServer())
        .get('/address')
        .send('not-a-uuid')
        .expect(400);
    });
  });

  describe('Performance and Load Scenarios', () => {
    it('should handle user with many addresses', async () => {
      const userResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'ManyAddresses123!',
          first_name: 'Many',
          last_name: 'Addresses',
        });

      const userId = userResponse.body.user.id;

      // Crear 10 direcciones
      const addressPromises = [];
      for (let i = 1; i <= 10; i++) {
        addressPromises.push(
          request(app.getHttpServer())
            .post('/address')
            .send({
              user_id: userId,
              street_address: `${i}00 Street Number ${i}`,
              city: `City${i}`,
              postal_code: `${i}0000`,
              details: `Address ${i} details`,
            }),
        );
      }

      await Promise.all(addressPromises);

      // Verificar que todas se crearon
      const response = await request(app.getHttpServer())
        .get('/address')
        .send(userId)
        .expect(200);

      expect(response.body.length).toBe(10);
    });
  });

  describe('Data Consistency Scenarios', () => {
    it('should maintain data consistency across profile updates and address retrieval', async () => {
      const userResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: generateTestEmail(),
          password: 'Consistency123!',
          first_name: 'Original',
          last_name: 'Name',
        });

      const userId = userResponse.body.user.id;

      // Agregar dirección
      await request(app.getHttpServer())
        .post('/address')
        .send({
          user_id: userId,
          street_address: '123 Consistency St',
          city: 'ConsCity',
          postal_code: '12345',
        });

      // Actualizar perfil
      await request(app.getHttpServer())
        .patch('/users/profile')
        .send({
          user_id: userId,
          first_name: 'Updated',
        });

      // Verificar que la dirección sigue vinculada al usuario
      const addressResponse = await request(app.getHttpServer())
        .get('/address')
        .send(userId)
        .expect(200);

      expect(addressResponse.body.length).toBeGreaterThanOrEqual(1);
      expect(addressResponse.body[0].user_id).toBe(userId);

      // Verificar que el perfil con direcciones muestra el nombre actualizado
      const profileResponse = await request(app.getHttpServer())
        .get('/users/profile-with-addresses')
        .send({ user_id: userId })
        .expect(200);

      expect(profileResponse.body.first_name).toBe('Updated');
      expect(profileResponse.body.addresses.length).toBeGreaterThanOrEqual(1);
    });
  });
});

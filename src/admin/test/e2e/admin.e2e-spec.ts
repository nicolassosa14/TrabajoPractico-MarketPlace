import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AdminModule } from '../../admin.module';


const mockSupabaseClient = {
  auth: {
    admin: {
      createUser: jest.fn(),
      listUsers: jest.fn(),
      updateUserById: jest.fn(),
      deleteUser: jest.fn(),
    },
  },
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

describe('Admin E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AdminModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Complete Admin Flow', () => {
    it('should complete full CRUD cycle', async () => {
      const userData = {
        email: 'e2e-test@test.com',
        password: 'password123',
        role: 'vendor',
      };


      mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
        data: { id: 'e2e-user-1', ...userData },
        error: null,
      });

      mockSupabaseClient.auth.admin.listUsers.mockResolvedValue({
        data: {
          users: [
            { id: 'e2e-user-1', email: userData.email, user_metadata: { role: userData.role } },
          ],
        },
        error: null,
      });

      mockSupabaseClient.auth.admin.updateUserById.mockResolvedValue({
        data: { id: 'e2e-user-1', email: 'updated@test.com', role: 'driver' },
        error: null,
      });

      mockSupabaseClient.auth.admin.deleteUser.mockResolvedValue({
        data: { success: true },
        error: null,
      });

      const createResponse = await request(app.getHttpServer())
        .post('/admin/create')
        .send(userData)
        .expect(201);

      expect(createResponse.body).toHaveProperty('id');
      expect(createResponse.body.email).toBe(userData.email);

      const listResponse = await request(app.getHttpServer())
        .get(`/admin/list/${userData.role}`)
        .expect(200);

      expect(Array.isArray(listResponse.body)).toBe(true);

      const updateData = {
        id: 'e2e-user-1',
        email: 'updated@test.com',
        password: 'newpassword',
        role: 'driver',
      };

      const updateResponse = await request(app.getHttpServer())
        .put('/admin/update')
        .send(updateData)
        .expect(200);

      expect(updateResponse.body).toHaveProperty('id');

      const deleteResponse = await request(app.getHttpServer())
        .delete('/admin/delete')
        .send({ id: 'e2e-user-1' })
        .expect(200);

      expect(deleteResponse.body).toEqual({ success: true });
    });
  });

  describe('Error Scenarios', () => {
    it('should handle Supabase errors gracefully', async () => {
      const userData = {
        email: 'error-test@test.com',
        password: 'password123',
        role: 'vendor',
      };

      mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
        data: null,
        error: { message: 'Supabase error: User already exists' },
      });

      await request(app.getHttpServer())
        .post('/admin/create')
        .send(userData)
        .expect(400);
    });

    it('should validate DTOs properly', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '',
        role: 'invalid-role',
      };

      await request(app.getHttpServer())
        .post('/admin/create')
        .send(invalidData)
        .expect(400);
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpException } from '@nestjs/common';
import  request from 'supertest';
import { AdminModule } from '../../admin.module';

const mockAdminRepository = {
  createUser: jest.fn(),
  findAllByRole: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

describe('Admin Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AdminModule],
    })
      .overrideProvider('AdminRepository')
      .useValue(mockAdminRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /admin/create', () => {
    it('should create a user successfully', async () => {
      const createDto = {
        email: 'test@test.com',
        password: 'password123',
        role: 'vendor',
      };

      mockAdminRepository.createUser.mockResolvedValue({
        id: '1',
        ...createDto,
      });

      const response = await request(app.getHttpServer())
        .post('/admin/create')
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(createDto.email);
      expect(mockAdminRepository.createUser).toHaveBeenCalled();
    });

    it('should handle repository error for invalid role', async () => {
      const createDto = {
        email: 'test@test.com',
        password: 'password123',
        role: 'invalid-role',
      };

      mockAdminRepository.createUser.mockRejectedValue(
        new HttpException('Rol "invalid-role" no permitido', 400)
      );

      await request(app.getHttpServer())
        .post('/admin/create')
        .send(createDto)
        .expect(400);
    });
  });

  describe('GET /admin/list/:role', () => {
    it('should return users by role', async () => {
      const role = 'vendor';
      const mockUsers = [
        { id: '1', email: 'vendor1@test.com', role: 'vendor' },
        { id: '2', email: 'vendor2@test.com', role: 'vendor' },
      ];

      mockAdminRepository.findAllByRole.mockResolvedValue(mockUsers);

      const response = await request(app.getHttpServer())
        .get(`/admin/list/${role}`)
        .expect(200);

      expect(response.body).toEqual(mockUsers);
      expect(mockAdminRepository.findAllByRole).toHaveBeenCalledWith(role);
    });

    it('should handle repository error for invalid role in param', async () => {
      mockAdminRepository.findAllByRole.mockRejectedValue(
        new HttpException('Rol "invalid-role" no permitido', 400)
      );

      await request(app.getHttpServer())
        .get('/admin/list/invalid-role')
        .expect(400);
    });
  });

  describe('PUT /admin/update', () => {
    it('should update a user successfully', async () => {
      const updateDto = {
        id: '1',
        email: 'updated@test.com',
        password: 'newpassword',
        role: 'driver',
      };

      mockAdminRepository.updateUser.mockResolvedValue(updateDto);

      const response = await request(app.getHttpServer())
        .put('/admin/update')
        .send(updateDto)
        .expect(200);

      expect(response.body).toEqual(updateDto);
      expect(mockAdminRepository.updateUser).toHaveBeenCalled();
    });
  });

  describe('DELETE /admin/delete', () => {
    it('should delete a user successfully', async () => {
      const deleteDto = { id: '1' };

      mockAdminRepository.deleteUser.mockResolvedValue({ success: true });

      const response = await request(app.getHttpServer())
        .delete('/admin/delete')
        .send(deleteDto)
        .expect(200);

      expect(response.body).toEqual({ success: true });
      expect(mockAdminRepository.deleteUser).toHaveBeenCalledWith('1');
    });
  });
});
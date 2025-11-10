import { Test } from '@nestjs/testing';
import { AdminController } from '../../presentation/admin.controller';
import { AdminService } from '../../service/admin.service';

describe('AdminController', () => {
  let adminController: AdminController;
  let adminService: AdminService;

  const mockAdminService = {
    createUser: jest.fn(),
    findAllByRole: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    adminController = moduleRef.get<AdminController>(AdminController);
    adminService = moduleRef.get<AdminService>(AdminService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { email: 'test@test.com', password: 'password123', role: 'vendor' };
      const expectedResult = { id: '1', ...dto };
      
      mockAdminService.createUser.mockResolvedValue(expectedResult);

      const result = await adminController.create(dto);

      expect(mockAdminService.createUser).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('listByRole', () => {
    it('should return users by role', async () => {
      const role = 'vendor';
      const expectedResult = [{ id: '1', email: 'vendor@test.com', role }];
      
      mockAdminService.findAllByRole.mockResolvedValue(expectedResult);

      const result = await adminController.listByRole(role);

      expect(mockAdminService.findAllByRole).toHaveBeenCalledWith(role);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = { id: '1', email: 'updated@test.com', password: 'newpass', role: 'driver' };
      const expectedResult = { ...dto };
      
      mockAdminService.updateUser.mockResolvedValue(expectedResult);

      const result = await adminController.update(dto);

      expect(mockAdminService.updateUser).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const dto = { id: '1' };
      const expectedResult = { success: true };
      
      mockAdminService.deleteUser.mockResolvedValue(expectedResult);

      const result = await adminController.delete(dto);

      expect(mockAdminService.deleteUser).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
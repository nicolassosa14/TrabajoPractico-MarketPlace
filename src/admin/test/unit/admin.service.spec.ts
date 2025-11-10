import { Test } from '@nestjs/testing';
import { AdminService } from '../../service/admin.service';
import { AdminRepository } from '../../domain/contract/admin.repository';
import Admin from '../../domain/model/admin';
import CreateAdminCommand from '../../service/DTO/CreateAdmin.dto';
import UpdateAdminCommand from '../../service/DTO/UpdateAdmin.dto';
import DeleteAdminCommand from '../../service/DTO/DeleteAdmin.dto';

describe('AdminService', () => {
  let adminService: AdminService;
  let adminRepository: AdminRepository;

  const mockAdminRepository = {
    createUser: jest.fn(),
    findAllByRole: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: 'AdminRepository',
          useValue: mockAdminRepository,
        },
      ],
    }).compile();

    adminService = moduleRef.get<AdminService>(AdminService);
    adminRepository = moduleRef.get('AdminRepository');
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const command = new CreateAdminCommand('test@test.com', 'password123', 'vendor');
      const expectedAdmin = new Admin('test@test.com', 'password123', 'vendor');
      
      mockAdminRepository.createUser.mockResolvedValue({ id: '1', ...expectedAdmin });

      const result = await adminService.createUser(command);

      expect(mockAdminRepository.createUser).toHaveBeenCalledWith(expectedAdmin);
      expect(result).toEqual({ id: '1', ...expectedAdmin });
    });
  });

  describe('findAllByRole', () => {
    it('should return users by role', async () => {
      const role = 'vendor';
      const expectedUsers = [{ id: '1', email: 'vendor@test.com', role: 'vendor' }];
      
      mockAdminRepository.findAllByRole.mockResolvedValue(expectedUsers);

      const result = await adminService.findAllByRole(role);

      expect(mockAdminRepository.findAllByRole).toHaveBeenCalledWith(role);
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const command = new UpdateAdminCommand('1', 'updated@test.com', 'newpassword', 'driver');
      const expectedAdmin = new Admin('updated@test.com', 'newpassword', 'driver', '1');
      
      mockAdminRepository.updateUser.mockResolvedValue(expectedAdmin);

      const result = await adminService.updateUser(command);

      expect(mockAdminRepository.updateUser).toHaveBeenCalledWith(expectedAdmin);
      expect(result).toEqual(expectedAdmin);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const command = new DeleteAdminCommand('1');
      
      mockAdminRepository.deleteUser.mockResolvedValue({ success: true });

      const result = await adminService.deleteUser(command);

      expect(mockAdminRepository.deleteUser).toHaveBeenCalledWith('1');
      expect(result).toEqual({ success: true });
    });
  });
});
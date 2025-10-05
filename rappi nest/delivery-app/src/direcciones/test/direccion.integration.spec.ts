import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DireccionesModule } from '../direccion.module';
import { Direccion } from '../entities/direccion.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { TipoUsuario } from '../../usuarios/entities/tipo-usuario.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../login/strategy/jwt-auth.guard';
import { RolesGuard } from '../../login/decorators/roles.guard';

describe('DireccionController (e2e)', () => {
  let app: INestApplication;
  let direccionRepo: Repository<Direccion>;
  let usuarioRepo: Repository<Usuario>;
  let tipoUsuarioRepo: Repository<TipoUsuario>;
  let authToken: string;
  let testUsuario: Usuario;
  let tipoClient: TipoUsuario;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Direccion, Usuario, TipoUsuario],
          synchronize: true,
        }),
        DireccionesModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { userId: 1, role: 'CLIENT' };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    direccionRepo = moduleFixture.get(getRepositoryToken(Direccion));
    usuarioRepo = moduleFixture.get(getRepositoryToken(Usuario));
    tipoUsuarioRepo = moduleFixture.get(getRepositoryToken(TipoUsuario));

    tipoClient = await tipoUsuarioRepo.save({
      nombre: 'CLIENT',
    });

    testUsuario = await usuarioRepo.save({
      nombre: 'Test',
      apellido: 'User',
      email: 'test@test.com',
      passwordHash: '$2b$10$hashedpassword',
      num_telefono: 1123456789,
      cod_area: 11,
      tipoUsuario: tipoClient,
    });

    authToken = 'Bearer test-token';
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // CORRECCIÓN: Usamos clear() en vez de delete({})
    await direccionRepo.clear();
  });

  describe('/direcciones (POST)', () => {
    it('debe crear una nueva dirección', async () => {
      const createDto = {
        usuario_id: testUsuario.id,
        calle: 'Av. Corrientes',
        altura: 1234,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
        pais: 'Argentina',
        latitud: -34.6037,
        longitud: -58.3816,
      };

      const response = await request(app.getHttpServer())
        .post('/direcciones')
        .set('Authorization', authToken)
        .send(createDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        calle: createDto.calle,
        altura: createDto.altura,
        ciudad: createDto.ciudad,
        provincia: createDto.provincia,
      });
    });

    it('debe fallar sin campos requeridos', async () => {
      const invalidDto = {
        calle: 'Av. Corrientes',
      };

      await request(app.getHttpServer())
        .post('/direcciones')
        .set('Authorization', authToken)
        .send(invalidDto)
        .expect(400);
    });

    it('debe crear dirección con campos opcionales', async () => {
      const createDto = {
        usuario_id: testUsuario.id,
        calle: 'Av. Corrientes',
        altura: 1234,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
        instrucciones_entrega: 'Tocar timbre 2 veces',
      };

      const response = await request(app.getHttpServer())
        .post('/direcciones')
        .set('Authorization', authToken)
        .send(createDto)
        .expect(201);

      expect(response.body.instrucciones_entrega).toBe(
        'Tocar timbre 2 veces',
      );
    });
  });

  describe('/direcciones (GET)', () => {
    beforeEach(async () => {
      await direccionRepo.save([
        {
          usuario: testUsuario,
          calle: 'Calle 1',
          altura: 100,
          ciudad: 'Buenos Aires',
          provincia: 'CABA',
          pais: 'Argentina',
        },
        {
          usuario: testUsuario,
          calle: 'Calle 2',
          altura: 200,
          ciudad: 'Córdoba',
          provincia: 'Córdoba',
          pais: 'Argentina',
        },
      ]);
    });

    it('debe retornar todas las direcciones del usuario', async () => {
      const response = await request(app.getHttpServer())
        .get('/direcciones')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('calle');
      expect(response.body[1]).toHaveProperty('calle');
    });
  });

  describe('/direcciones/:id (GET)', () => {
    let direccion: Direccion;

    beforeEach(async () => {
      direccion = await direccionRepo.save({
        usuario: testUsuario,
        calle: 'Av. Test',
        altura: 999,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
        pais: 'Argentina',
      });
    });

    it('debe retornar una dirección específica', async () => {
      const response = await request(app.getHttpServer())
        .get(`/direcciones/${direccion.id}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).toMatchObject({
        id: direccion.id,
        calle: 'Av. Test',
        altura: 999,
      });
    });

    it('debe retornar 404 si la dirección no existe', async () => {
      await request(app.getHttpServer())
        .get('/direcciones/999999')
        .set('Authorization', authToken)
        .expect(404);
    });
  });

  describe('/direcciones/:id (PATCH)', () => {
    let direccion: Direccion;

    beforeEach(async () => {
      direccion = await direccionRepo.save({
        usuario: testUsuario,
        calle: 'Calle Original',
        altura: 100,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
        pais: 'Argentina',
      });
    });

    it('debe actualizar una dirección', async () => {
      const updateDto = {
        calle: 'Calle Actualizada',
        altura: 5678,
      };

      const response = await request(app.getHttpServer())
        .patch(`/direcciones/${direccion.id}`)
        .set('Authorization', authToken)
        .send(updateDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: direccion.id,
        calle: 'Calle Actualizada',
        altura: 5678,
        ciudad: 'Buenos Aires',
      });
    });

    it('debe actualizar solo los campos enviados', async () => {
      const updateDto = {
        instrucciones_entrega: 'Nueva instrucción',
      };

      const response = await request(app.getHttpServer())
        .patch(`/direcciones/${direccion.id}`)
        .set('Authorization', authToken)
        .send(updateDto)
        .expect(200);

      expect(response.body).toMatchObject({
        calle: 'Calle Original',
        instrucciones_entrega: 'Nueva instrucción',
      });
    });

    it('debe retornar 404 al actualizar dirección inexistente', async () => {
      await request(app.getHttpServer())
        .patch('/direcciones/999999')
        .set('Authorization', authToken)
        .send({ calle: 'Test' })
        .expect(404);
    });
  });

  describe('/direcciones/:id (DELETE)', () => {
    let direccion: Direccion;

    beforeEach(async () => {
      direccion = await direccionRepo.save({
        usuario: testUsuario,
        calle: 'Calle a Eliminar',
        altura: 100,
        ciudad: 'Buenos Aires',
        provincia: 'CABA',
        pais: 'Argentina',
      });
    });

    it('debe eliminar una dirección', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/direcciones/${direccion.id}`)
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Dirección eliminada correctamente',
      });

      const deleted = await direccionRepo.findOne({
        where: { id: direccion.id },
      });
      expect(deleted).toBeNull();
    });

    it('debe retornar 404 al eliminar dirección inexistente', async () => {
      await request(app.getHttpServer())
        .delete('/direcciones/999999')
        .set('Authorization', authToken)
        .expect(404);
    });
  });

  describe('Validaciones', () => {
    it('debe aceptar valores por defecto', async () => {
      const dto = {
        usuario_id: testUsuario.id,
        calle: 'Test',
        altura: 100,
        ciudad: 'Test',
        provincia: 'Test',
      };

      const response = await request(app.getHttpServer())
        .post('/direcciones')
        .set('Authorization', authToken)
        .send(dto)
        .expect(201);

      expect(response.body.pais).toBe('Argentina');
    });
  });
});

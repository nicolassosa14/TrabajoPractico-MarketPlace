import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { TipoUsuario } from '../entities/tipo-usuario.entity';
import { UsuariosModule } from '../usuarios.module';
import { DataSource } from 'typeorm';
import { Direccion } from '../../direcciones/entities/direccion.entity';

describe('UsuarioController (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let usuarioId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsuariosModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Usuario, TipoUsuario,Direccion],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    dataSource = moduleFixture.get(DataSource);

    // Insertar rol 'cliente'
    await dataSource.getRepository(TipoUsuario).save({ nombre: 'cliente' });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('debe crear un usuario correctamente', async () => {
      const dto = {
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'juan@mail.com',
        password: '123456',
        num_telefono: 12345678,
        cod_area: 11,
      };

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(dto)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('role', 'CLIENTE');
      expect(res.body).not.toHaveProperty('passwordHash');

      usuarioId = res.body.id; // guardamos id para tests posteriores
    });

    it('debe lanzar conflicto si el email ya existe', async () => {
      const dto = {
        nombre: 'Juan2',
        apellido: 'Perez',
        email: 'juan@mail.com', // mismo email
        password: '123456',
        num_telefono: 12345678,
        cod_area: 11,
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(dto)
        .expect(409); // Conflict
    });

    it('debe validar email y campos obligatorios', async () => {
      const dto = {
        nombre: '',
        apellido: '',
        email: 'not-an-email',
        password: '123',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(dto)
        .expect(400);

      expect(res.body.message.length).toBeGreaterThan(0);
    });
  });

  describe('/usuarios/profile/:id (GET)', () => {
    it('debe obtener perfil correctamente', async () => {
      // Buscamos el usuario en DB y validamos que exista
      const usuario = await dataSource.getRepository(Usuario).findOneBy({ email: 'juan@mail.com' });
      if (!usuario) throw new Error('Usuario de prueba no encontrado');

      const res = await request(app.getHttpServer())
        .get(`/usuarios/profile/${usuario.id}`)
        .expect(200);

      expect(res.body).toHaveProperty('id', usuario.id);
      expect(res.body).toHaveProperty('role', 'CLIENTE');
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      await request(app.getHttpServer())
        .get(`/usuarios/profile/9999`)
        .expect(404);
    });
  });

  describe('/usuarios/profile/:id (PATCH)', () => {
    it('debe actualizar nombre y contraseña correctamente', async () => {
      // Buscamos usuario para estar seguros
      const usuario = await dataSource.getRepository(Usuario).findOneBy({ id: usuarioId });
      if (!usuario) throw new Error('Usuario de prueba no encontrado');

      const res = await request(app.getHttpServer())
        .patch(`/usuarios/profile/${usuario.id}`)
        .send({ nombre: 'Juan Updated', password: 'newpassword' })
        .expect(200);

      expect(res.body).toHaveProperty('nombre', 'Juan Updated');
      expect(res.body).toHaveProperty('role', 'CLIENTE');
    });

    it('debe lanzar NotFoundException al actualizar usuario inexistente', async () => {
      await request(app.getHttpServer())
        .patch(`/usuarios/profile/9999`)
        .send({ nombre: 'No User' })
        .expect(404);
    });
  });
});

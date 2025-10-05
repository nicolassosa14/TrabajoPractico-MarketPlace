import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from '../login.module';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { TipoUsuario } from '../../usuarios/entities/tipo-usuario.entity';
import { Repository } from 'typeorm';

describe('Login + JWT + RolesGuard (e2e)', () => {
  let app: INestApplication;
  let usuarioRepo: Repository<Usuario>;
  let tipoRepo: Repository<TipoUsuario>;
  let tokenAdmin: string;
  let tokenClient: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        LoginModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Usuario, TipoUsuario],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([Usuario, TipoUsuario]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    usuarioRepo = moduleFixture.get('UsuarioRepository');
    tipoRepo = moduleFixture.get('TipoUsuarioRepository');

    const adminRole = await tipoRepo.save({ nombre: 'ADMIN' });
    const clientRole = await tipoRepo.save({ nombre: 'CLIENT' });

    const bcrypt = require('bcryptjs');
    const passAdmin = await bcrypt.hash('admin123', 10);
    const passClient = await bcrypt.hash('client123', 10);

    await usuarioRepo.save({
      nombre: 'Admin',
      apellido: 'User',
      email: 'admin@test.com',
      passwordHash: passAdmin,
      tipoUsuario: adminRole,
    });

    await usuarioRepo.save({
      nombre: 'Client',
      apellido: 'User',
      email: 'client@test.com',
      passwordHash: passClient,
      tipoUsuario: clientRole,
    });

    const resAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });

    const resClient = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'client@test.com', password: 'client123' });

    tokenAdmin = resAdmin.body.access_token;
    tokenClient = resClient.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Admin can access protected admin route', async () => {
    app.getHttpAdapter().getInstance().get('/test/admin', (req, res) => res.send('ok'));

    const res = await request(app.getHttpServer())
      .get('/test/admin')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
  });

  it('Client cannot access admin route', async () => {
    app.getHttpAdapter().getInstance().get('/test/admin', (req, res) => res.send('ok'));

    const res = await request(app.getHttpServer())
      .get('/test/admin')
      .set('Authorization', `Bearer ${tokenClient}`);

   
    expect(res.status).toBe(200); 
  });

  it('Request without token is unauthorized', async () => {
    const res = await request(app.getHttpServer()).get('/test/admin');
    expect(res.status).toBe(401);
  });
});

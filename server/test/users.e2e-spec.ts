import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    // Register a test user
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Test User',
      email: 'test_e2e@example.com',
      password: 'password123',
    });

    // Login to get JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test_e2e@example.com',
        password: 'password123',
      });

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('/users/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('address');
        expect(res.body).toHaveProperty('company');
      });
  });

  it('/users (POST) - protected endpoint', async () => {
    // Without token should be unauthorized
    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'New User',
        username: 'newuser',
        email: 'newuser@example.com',
        address: {
          street: 'Test Street',
          suite: 'Suite 100',
          city: 'Test City',
          zipcode: '12345',
          geo: {
            lat: '40.7128',
            lng: '-74.0060',
          },
        },
        phone: '123-456-7890',
        website: 'example.com',
        company: {
          name: 'Test Company',
          catchPhrase: 'Testing is important',
          bs: 'test business',
        },
      })
      .expect(401);

    // With token should be successful
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'New User',
        username: 'newuser',
        email: 'newuser@example.com',
        address: {
          street: 'Test Street',
          suite: 'Suite 100',
          city: 'Test City',
          zipcode: '12345',
          geo: {
            lat: '40.7128',
            lng: '-74.0060',
          },
        },
        phone: '123-456-7890',
        website: 'example.com',
        company: {
          name: 'Test Company',
          catchPhrase: 'Testing is important',
          bs: 'test business',
        },
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'New User');
        expect(res.body).toHaveProperty('email', 'newuser@example.com');
      });
  });
});

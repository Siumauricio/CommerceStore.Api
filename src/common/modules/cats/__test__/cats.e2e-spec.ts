import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CatsService } from '../cats.service';
import { CatsModule } from '../cats.module';

describe('Cats', () => {
  let app: INestApplication;
  const catsService = {
    findAll: () => [
      { age: 1, breed: '1', name: '1' },
      { age: 2, breed: '2', name: '2' },
    ],
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer()).get('/cats').expect(200).expect({
      data: catsService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

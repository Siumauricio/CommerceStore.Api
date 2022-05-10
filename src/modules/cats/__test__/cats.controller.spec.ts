import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from '../cats.controller';
import { CatsService } from '../cats.service';
import { CreateCatDto } from '../dto/create-cat.dto';

describe('CatsController', () => {
  let catsController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [CatsService],
    }).compile();

    catsController = module.get<CatsController>(CatsController);
    catsService = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(catsController).toBeDefined();
    expect(catsService).toBeDefined();
  });
  it('should return an array of cats', async () => {
    const result: CreateCatDto[] = [
      { age: 1, breed: '1', name: '1' },
      { age: 2, breed: '2', name: '2' },
    ];
    jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

    expect(await catsController.findAll()).toBe(result);
  });
  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from '../../../common/config/apiresponse';
import { mockEntity } from '../../../common/config/mockentity';
import {
  MockType,
  repositoryMockFactory,
} from '../../../common/mocks/mock.factory';
import {
  MockProducts,
  Products,
} from '../../../repository/entities/products.entity';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let repositoryMock: MockType<Repository<Products>>;
  let productsService: ProductsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: ProductsService,
          useValue: {
            getAllProducts: jest.fn(),
            getProductById: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Products),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    repositoryMock = module.get(getRepositoryToken(Products));
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
    expect(repositoryMock).toBeDefined();
    expect(productsService).toBeDefined();
  });

  it('should get all products', async () => {
    const res = mockEntity<Products>(new MockProducts(), true);
    if (Array.isArray(res)) {
      // console.log(res);

      const mockResponse: ApiResponse<Products[]> = {
        message: 'Products retrieved successfully',
        data: res,
        statusCode: 200,
      };
      jest
        .spyOn(productsService, 'getAllProducts')
        .mockResolvedValue(mockResponse);
      // repositoryMock.find.mockReturnValue(res);
      const result = await productsController.getAllProducts();
      expect(result).toEqual(mockResponse);
    }
  });

  it('should get a product by id', async () => {
    const res = mockEntity<Products>(new MockProducts(), false);
    if (!Array.isArray(res)) {
      const mockResponse: ApiResponse<Products> = {
        message: 'Products retrieved successfully',
        data: res,
        statusCode: 200,
      };
      jest
        .spyOn(productsService, 'getProductById')
        .mockResolvedValue(mockResponse);
      // repositoryMock.find.mockReturnValue(res);
      const result = await productsController.getProductById(res.idProduct);
      expect(result).toEqual(mockResponse);
    }
  });

  it('should create a product', async () => {
    const res = mockEntity<Products>(new MockProducts(), false);
    if (!Array.isArray(res)) {
      const mockResponse: ApiResponse<Products> = {
        message: 'Product created successfully',
        data: res,
        statusCode: 200,
      };
      jest
        .spyOn(productsService, 'createProduct')
        .mockResolvedValue(mockResponse);
      const result = await productsController.createProduct(null);
      expect(result).toEqual(mockResponse);
    }
  });

  it('should update a Product', async () => {
    const res = mockEntity<Products>(new MockProducts(), false);
    if (!Array.isArray(res)) {
      const mockResponse: ApiResponse<Products> = {
        message: 'Product updated successfully',
        data: res,
        statusCode: 200,
      };
      jest
        .spyOn(productsService, 'updateProduct')
        .mockResolvedValue(mockResponse);
      const result = await productsController.updateProduct('1', null);
      expect(result).toEqual(mockResponse);
    }
  });

  it('should delete a Product', async () => {
    const res = mockEntity<Products>(new MockProducts(), false);
    if (!Array.isArray(res)) {
      const mockResponse: ApiResponse<Products> = {
        message: 'Product deleted successfully',
        data: undefined,
        statusCode: 200,
      };
      jest
        .spyOn(productsService, 'deleteProduct')
        .mockResolvedValue(mockResponse);
      const result = await productsController.deleteProduct('1');
      expect(result).toEqual(mockResponse);
    }
  });

  it('should get not found if product cant be found', async () => {
    const res = mockEntity<Products>(new MockProducts(), false);
    if (!Array.isArray(res)) {
      const mockResponse: ApiResponse<Products> = {
        message: 'Product not found',
        statusCode: 404,
      };
      jest
        .spyOn(productsService, 'deleteProduct')
        .mockResolvedValue(mockResponse);
      const result = await productsController.deleteProduct('1');
      expect(result).toEqual(mockResponse);
    }
  });
});

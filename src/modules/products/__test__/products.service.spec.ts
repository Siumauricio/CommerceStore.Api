import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { isArray } from 'class-validator';
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
import { CreateProductDto, UpdateProductDto } from '../product.dto';
import { ProductsService } from '../products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let repositoryMock: MockType<Repository<Products>>;
  let productsRepository: Repository<Products>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsService,
          useValue: {
            getProductById: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
        ProductsService,
        {
          provide: getRepositoryToken(Products),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repositoryMock = module.get(getRepositoryToken(Products));
    productsRepository = module.get<Repository<Products>>(
      getRepositoryToken(Products),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repositoryMock).toBeDefined();
  });

  it('should return all products', async () => {
    const res = mockEntity<Products>(new MockProducts(), true);
    if (Array.isArray(res)) {
      const mockResponse: ApiResponse<Products[]> = {
        message: 'Products retrieved successfully',
        data: res,
        statusCode: 200,
      };
      repositoryMock.find.mockReturnValue(res);
      const result = await service.getAllProducts();
      expect(result).toEqual(mockResponse);
    }
  });

  it('should return product by id', async () => {
    const res = mockEntity<Products>(new MockProducts());
    if (!Array.isArray(res)) {
      const idProduct = res.idProduct;
      const mockResponse: ApiResponse<Products> = {
        message: 'Product retrieved successfully',
        data: res,
        statusCode: 200,
      };
      // repositoryMock.findOne.mockReturnValue(res);
      repositoryMock.findOne.mockReturnValue(res);
      const result = await service.getProductById(idProduct);
      expect(result).toEqual(mockResponse);
    }
  });

  it('should create a product', async () => {
    const res = mockEntity<Products>(new MockProducts());
    if (!Array.isArray(res)) {
      const mockResponse: ApiResponse<Products> = {
        message: 'Product created successfully',
        data: res,
        statusCode: 201,
      };
      repositoryMock.save.mockReturnValue(res);

      const result = await service.createProduct(
        res as unknown as CreateProductDto,
      );
      expect(result).toEqual(mockResponse);
    }
  });
  it('should update a product', async () => {
    const res = mockEntity<Products>(new MockProducts());
    if (!Array.isArray(res)) {
      const idProduct = res.idProduct;
      const mockResponse: ApiResponse<Products> = {
        message: 'Product updated successfully',
        data: res,
        statusCode: 200,
      };
      const findResponse = repositoryMock.findOne.mockReturnValue(res);
      repositoryMock.save.mockReturnValue(findResponse());
      const result = await service.updateProduct(
        idProduct,
        res as unknown as UpdateProductDto,
      );
      expect(result).toEqual(mockResponse);
    }
  });
  it('should return bad status if product not found when trying to update', async () => {
    const res = mockEntity<Products>(new MockProducts());
    if (!Array.isArray(res)) {
      const idProduct = res.idProduct;
      const mockResponse: ApiResponse<Products> = {
        message: 'Product not found',
        data: undefined,
        statusCode: 404,
      };
      repositoryMock.findOne.mockReturnValue(null);
      repositoryMock.save.mockReturnValue(null);
      const result = await service.updateProduct(
        idProduct,
        res as unknown as UpdateProductDto,
      );
      expect(result).toEqual(mockResponse);
    }
  });

  it('should delete product ', async () => {
    const res = mockEntity<Products>(new MockProducts());
    if (!Array.isArray(res)) {
      const idProduct = res.idProduct;
      const mockResponse: ApiResponse<Products> = {
        message: 'Product deleted successfully',
        data: undefined,
        statusCode: 200,
      };
      repositoryMock.findOne.mockReturnValue(res);
      repositoryMock.delete.mockReturnValue(res);
      const result = await service.deleteProduct(idProduct);
      expect(result).toEqual(mockResponse);
    }
  });

  it('should return bad request if product not found when trying to delete ', async () => {
    const res = mockEntity<Products>(new MockProducts());
    if (!Array.isArray(res)) {
      const idProduct = res.idProduct;
      const mockResponse: ApiResponse<Products> = {
        message: 'Product not found',
        data: undefined,
        statusCode: 404,
      };
      repositoryMock.findOne.mockReturnValue(null);
      repositoryMock.delete.mockReturnValue(null);
      const result = await service.deleteProduct(idProduct);
      expect(result).toEqual(mockResponse);
    }
  });
});

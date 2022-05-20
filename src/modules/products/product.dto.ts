import { IsDecimal, IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductDto {
  @Field()
  @ApiProperty()
  @IsString()
  productName: string;

  @Field()
  @ApiProperty()
  @IsString()
  description: string;

  @Field()
  @ApiProperty()
  @IsNumber()
  price: number;

  @Field()
  @ApiProperty()
  @IsInt()
  stock: number;
}
export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsString()
  description: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsInt()
  stock: number;
}

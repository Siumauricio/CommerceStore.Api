import { isArray } from 'class-validator';
import { HttpStatus, Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export interface ApiResponse<T> {
  statusCode: HttpStatus;
  message: string;
  data?: T;
}
export const ApiResponse = <T>(
  statusCode: HttpStatus,
  message: string,
  data?: T,
) => {
  return { statusCode, message, data };
};

export function QueryResponse<T>(ItemType: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class QueryResponse {
    @Field({ nullable: false })
    statusCode?: HttpStatus;

    @Field({ nullable: false })
    message?: string;

    @Field(() => ItemType, { nullable: true })
    data?: T;
  }
  return QueryResponse;
}
export function QueryResponseArray<T>(ItemType: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class QueryResponseArray {
    @Field({ nullable: false })
    statusCode?: HttpStatus;

    @Field({ nullable: false })
    message?: string;

    @Field(() => [ItemType], { nullable: true })
    data?: T[];
  }
  return QueryResponseArray;
}

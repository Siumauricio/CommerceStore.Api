import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';

export const mockEntity = <T>(entity: T, rArray?: boolean): T | T[] => {
  if (rArray) {
    const obj: T[] = [];
    for (let i = 0; i < 10; i++) {
      Object.keys(entity).forEach((key) => {
        if (typeof entity[key] === 'string' && key.includes('id')) {
          entity[key] = randomUUID();
        } else {
          if (typeof entity[key] === 'string') {
            entity[key] = faker.random.word();
          }
        }
        if (typeof entity[key] === 'number') {
          entity[key] = faker.datatype.number();
        }
      });
      obj.push(entity);
    }
    return obj;
  } else {
    faker.seed(42);

    Object.keys(entity).forEach((key) => {
      if (typeof entity[key] === 'string' && key.includes('id')) {
        entity[key] = faker.datatype.uuid();
      } else {
        if (typeof entity[key] === 'string') {
          entity[key] = faker.random.word();
        }
      }
      if (typeof entity[key] === 'number') {
        entity[key] = faker.datatype.number();
      }
    });
    return entity;
  }
};

import { instanceToPlain, plainToClass } from 'class-transformer';

export const dtoToEntity = <T>(obj: T): any => {
  const data = instanceToPlain(obj);
  const obj2: T = { ...obj, ...data };
  // return plainToClass(T as any, obj);
};

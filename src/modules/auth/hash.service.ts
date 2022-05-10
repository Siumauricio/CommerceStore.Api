import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class HashService {
  hashPassword = async (password: string): Promise<string> => {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  };
  comparePassword = async (
    password: string,
    hash: string,
  ): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  };
}

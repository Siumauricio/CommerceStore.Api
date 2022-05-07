import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  lastname: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsInt()
  age: number;

  @ApiProperty()
  @IsString()
  email: string;
}

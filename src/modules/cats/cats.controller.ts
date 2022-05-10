import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { Cats } from '../../decorators/cat.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';
// import typeorm from '@nestjs/typeorm';
@Controller('cats')
@UseFilters(AllExceptionsFilter)
// @UseInterceptors(ErrorsInterceptor)
export class CatsController {
  constructor(private catsService: CatsService) {}

  // @Post()
  // @UseGuards(RolesGuard)
  // @UseInterceptors(ErrorsInterceptor)
  // async create(@Body() createCatDto: CreateCatDto) {
  //   throw new BadRequestException();
  // }
  @Post()
  async create(
    @Cats('name') name: string,
    @Cats('age') age: string,
    @Cats('breed') breed: string,
  ) {
    console.log(name);
    console.log(age);
    console.log(breed);
    return name;
  }
  @Get()
  // @Roles('admin')
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.catsService.findOne(id);
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Auth } from '../../decorators/auth.decorator';
import { AuthRegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Role } from './roles.enum';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async auth(@Req() req) {
    return this.authService.login(req.user);
  }
  @Post('register')
  async register(@Body() authDto: AuthRegisterDto) {
    return this.authService.register(authDto);
  }

  // @Roles(Role.Admin)
  @Auth(Role.Member)
  @Post('register2')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get()
  getPagination(@Req() request: Request, @Res() response: Response) {
    const { count, page } = request.query;
    if (!count || !page) {
      response.status(400).send('Bad request');
    } else {
      response.send(200);
    }
  }
}

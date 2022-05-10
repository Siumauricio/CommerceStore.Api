import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Users } from 'src/repository/entities/users.entity';
import { AuthDto, AuthRegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth-guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async auth(@Request() req, @Body() authDto: AuthDto) {
    return this.authService.login(req.user);
  }
  @Post('register')
  async register(@Body() authDto: AuthRegisterDto) {
    return this.authService.register(authDto);
  }
  @Post('register2')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}

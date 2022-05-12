import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Auth } from '../../decorators/auth.decorator';
import { AuthDto, AuthRegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Role } from './roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // , @Body() authDto: AuthDto
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async auth(@Request() req) {
    return this.authService.login(req.user);
  }
  @Post('register')
  async register(@Body() authDto: AuthRegisterDto) {
    return this.authService.register(authDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.Admin)
  // @UseGuards(RolesGuard)
  @Auth(Role.Member)
  @Post('register2')
  getProfile(@Request() req) {
    return req.user;
  }
}

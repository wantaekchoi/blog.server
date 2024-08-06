import {
  Controller,
  Post,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { RequestWithMember } from './request-with-member.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req: RequestWithMember) {
    const { user: member } = req;
    if (!member) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.authService.login(member);
    await this.authService.setCurrentRefreshToken(
      tokens.refreshToken,
      member.id,
    );
    return tokens;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: RequestWithMember) {
    const { user: member } = req;
    const accessToken = this.authService.getAccessToken({
      sub: member.id,
      email: member.email,
    });
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: RequestWithMember) {
    const { user: member } = req;
    await this.authService.removeRefreshToken(member.id);
  }
}

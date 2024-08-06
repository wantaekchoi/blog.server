import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { MemberService } from '../../member/member.service';
import { RefreshTokenRepository } from '../refresh-token.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private memberService: MemberService,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: 'jwt_refresh_secret',
    });
  }

  async validate(req: Request, payload: any) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const refreshToken = authHeader.replace('Bearer', '').trim();
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const memberId = payload.sub;
    const storedHashedRefreshToken =
      await this.refreshTokenRepository.getRefreshToken(memberId);
    if (!storedHashedRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      storedHashedRefreshToken,
    );
    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.memberService.findById(memberId);
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MemberService } from '../../member/member.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly membersService: MemberService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'accessSecret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return this.membersService.findByEmail(payload.sub);
  }
}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { MemberModule } from '../member/member.module';
import { RefreshTokenRepository } from './refresh-token.repository';

@Module({
  imports: [
    MemberModule,
    PassportModule,
    JwtModule.register({
      secret: 'accessSecret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    RefreshTokenRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

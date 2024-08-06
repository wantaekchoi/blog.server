import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from '../member/member.service';
import * as bcrypt from 'bcrypt';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async validateMember(email: string, pass: string): Promise<any> {
    const member = await this.memberService.findByEmail(email);
    if (member && pass === member.password) {
      const { password, ...result } = member;
      return result;
    }
    return null;
  }

  async login(member: any) {
    const payload = { email: member.email, sub: member.id };
    const accessToken = this.getAccessToken(payload);
    const refreshToken = this.getRefreshToken(payload);
    await this.refreshTokenRepository.setRefreshToken(member.id, refreshToken);
    return { accessToken, refreshToken };
  }

  getAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: 'accessSecret',
      expiresIn: '15m',
    });
  }

  getRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: 'refreshSecret',
      expiresIn: '7d',
    });
  }

  async getMemberIfRefreshTokenMatches(refreshToken: string, memberId: number) {
    const storedRefreshToken =
      await this.refreshTokenRepository.getRefreshToken(memberId);
    if (!storedRefreshToken) {
      throw new UnauthorizedException();
    }
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      storedRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return await this.memberService.findById(memberId);
    }
    return null;
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    memberId: number,
  ): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.refreshTokenRepository.setRefreshToken(
      memberId,
      currentHashedRefreshToken,
    );
  }

  async removeRefreshToken(memberId: number) {
    return this.refreshTokenRepository.removeRefreshToken(memberId);
  }
}

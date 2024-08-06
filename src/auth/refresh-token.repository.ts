import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenRepository {
  private refreshTokens: { [key: number]: string } = {};

  async setRefreshToken(memberId: number, refreshToken: string): Promise<void> {
    this.refreshTokens[memberId] = refreshToken;
  }

  async getRefreshToken(memberId: number): Promise<string | undefined> {
    return this.refreshTokens[memberId];
  }

  async removeRefreshToken(memberId: number): Promise<void> {
    delete this.refreshTokens[memberId];
  }
}

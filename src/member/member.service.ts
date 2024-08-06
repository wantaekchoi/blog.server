import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from './entities/member.entity';
import { Repository } from 'typeorm';
import { Nullable } from 'src/type';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  async findById(id: number): Promise<Nullable<MemberEntity>> {
    return this.memberRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Nullable<MemberEntity>> {
    return this.memberRepository.findOne({ where: { email } });
  }
}

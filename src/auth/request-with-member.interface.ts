import { Request } from 'express';
import { MemberEntity } from '../member/entities/member.entity';

export interface RequestWithMember extends Request {
  user: MemberEntity;
}

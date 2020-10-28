import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnterpriseMemberController } from './enterprise-member.controller';
import { EnterpriseMemberSchema } from './enterprise-member.schema';
import { EnterpriseMemberService } from './enterprise-member.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'EnterpriseMember', schema: EnterpriseMemberSchema }
    ])
  ],
  controllers: [EnterpriseMemberController],
  providers: [EnterpriseMemberService],
  exports: [EnterpriseMemberService]
})
export class EnterpriseMemberModule {}

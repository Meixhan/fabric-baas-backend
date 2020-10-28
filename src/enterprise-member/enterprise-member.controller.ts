import { Controller, Logger, Get, Post, Body, Param } from '@nestjs/common';
import { EnterpriseMember } from './enterprise-member.schema';
import { EnterpriseMemberService } from './enterprise-member.service';

@Controller('enterprises')
export class EnterpriseMemberController {
  private readonly logger = new Logger(EnterpriseMemberController.name);
  constructor(
    private readonly enterpriseMemberService: EnterpriseMemberService
  ) {}

  @Get('/listAll')
  getAllEnterprises(): Promise<{ list: EnterpriseMember[] }> {
    return this.enterpriseMemberService.getAllEnterprises();
  }

  @Post('addEnterprise')
  addEnterprise(
    @Body() enterpriseMember: EnterpriseMember
  ): Promise<EnterpriseMember> {
    return this.enterpriseMemberService.create(enterpriseMember);
  }

  @Post('query')
  queryAllEnterpriseMember(
    @Body() parameters
  ): Promise<{ totalDocs: number; list: EnterpriseMember[] }> {
    const companyName = parameters.companyName;
    const createTimeStart = parameters.createTimeStart;
    const createTimeEnd = parameters.createTimeEnd;
    const approvalStatus = parameters.approvalStatus;
    return this.enterpriseMemberService.queryAllEnterpriseMember(
      companyName,
      createTimeStart,
      createTimeEnd,
      approvalStatus
    );
  }

  @Post('valid')
  changeValidStatus(@Body() parameters) {
    const id = parameters.id;
    const isValid = parameters.isValid;
    this.enterpriseMemberService.changeValidStatus(id, isValid);
  }

  @Get('/:id')
  getEnterpriseMemberDetail(
    @Param('id') id: string
  ): Promise<EnterpriseMember> {
    this.logger.log(`received id = ${id}`);
    return this.enterpriseMemberService.getEnterpriseMemberDetail(id);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  EnterpriseMember,
  EnterpriseMemberDocument
} from './enterprise-member.schema';

@Injectable()
export class EnterpriseMemberService {
  private readonly logger = new Logger(EnterpriseMemberService.name);
  constructor(
    @InjectModel('EnterpriseMember')
    private readonly enterpriseMemberModel: Model<EnterpriseMemberDocument>
  ) {}

  async getAllEnterprises(): Promise<{ list: EnterpriseMember[] }> {
    const data = await this.enterpriseMemberModel.find();
    return { list: data };
  }

  async create(enterpriseMember: EnterpriseMember): Promise<EnterpriseMember> {
    const newEnterpriseMember = new this.enterpriseMemberModel(
      enterpriseMember
    );
    return await newEnterpriseMember.save();
  }

  async getEnterpriseMemberDetail(id: string): Promise<EnterpriseMember> {
    const _id = new ObjectId(id);
    const data = await this.enterpriseMemberModel.findOne({
      _id: _id
    });
    this.logger.log('ObjectId:' + _id);
    return data;
  }

  async queryAllEnterpriseMember(
    companyName: string,
    createTimeStart: number,
    createTimeEnd: number,
    approvalStatus: number
  ): Promise<{ totalDocs: number; list: EnterpriseMember[] }> {
    // const companyNameResult = await this.queryByCompanyName(companyName).then(
    //   data => data
    // );
    // this.logger.log(`size of companyNameResult: ${companyNameResult.length}`);
    // this.logger.log(`companyNameResult: ${companyNameResult}`);

    // const createTimeResult = await this.queryByCreateTime(
    //   createTimeStart,
    //   createTimeEnd
    // ).then(data => data);
    // this.logger.log(`size of createTimeResult: ${createTimeResult.length}`);
    // this.logger.log(`createTimeResult: ${createTimeResult}`);

    // const approvalStatusResult = await this.queryByApprovalStatus(
    //   approvalStatus
    // ).then(data => data);
    // this.logger.log(
    //   `size of approvalStatusResult: ${approvalStatusResult.length}`
    // );
    // this.logger.log(`approvalStatusResult: ${approvalStatusResult}`);

    // const intersectResult = companyNameResult
    //   .filter(x => new Set(createTimeResult).has(x))
    //   .filter(x => new Set(approvalStatusResult).has(x));

    // this.logger.log(`size of result: ${intersectResult.length}`);

    var conditions: ConditionObject = {};

    if (companyName) {
      const companyNameString = '/' + companyName + '/';
      this.logger.log(
        `${companyNameString}: query company name contains '${companyName}'`
      );
      conditions.companyName = { $regex: eval(`/${companyName}/`) };
    }

    const createDateStart = new Date(createTimeStart);
    const createDateEnd = new Date(createTimeEnd);
    if (createTimeStart && createTimeEnd) {
      this.logger.log(`search from ${createDateStart} to ${createDateEnd}`);
      conditions.createdAt = { $gte: createDateStart, $lte: createDateEnd };
    } else if (createTimeStart && !createTimeEnd) {
      conditions.createdAt = { $gte: createDateStart };
    } else if (!createTimeStart && createTimeEnd) {
      conditions.createdAt = { $lte: createDateEnd };
    }

    if (approvalStatus != -1) {
      conditions.approvalStatus = approvalStatus;
    }

    const data: EnterpriseMember[] = await this.enterpriseMemberModel.find(
      conditions
    );
    const count = data.length;
    return { totalDocs: count, list: data };
  }

  async changeValidStatus(id: string, isValid: number) {
    const _id = new ObjectId(id);
    await this.enterpriseMemberModel.update(
      {
        _id: _id
      },
      {
        isValid: isValid
      }
    );
  }

  // async queryByCompanyName(
  //   companyName: string
  // ): Promise<EnterpriseMemberDocument[]> {
  //   if (companyName) {
  //     const companyNameString = '/' + companyName + '/';
  //     this.logger.log(
  //       `${companyNameString}: query company name contains '${companyName}'`
  //     );
  //     const conditions = {
  //       companyName: { $regex: eval(`/${companyName}/`) }
  //     };
  //     // const data = await this.enterpriseMemberModel.find({
  //     //   companyName: { $regex: eval(`/${companyName}/`) }
  //     // });
  //     const data = await this.enterpriseMemberModel.find(conditions);
  //     return data;
  //   } else {
  //     return await this.enterpriseMemberModel.find();
  //   }
  // }
  // async queryByCreateTime(
  //   createTimeStart: number,
  //   createTimeEnd: number
  // ): Promise<EnterpriseMemberDocument[]> {
  //   const createDateStart = new Date(createTimeStart);
  //   const createDateEnd = new Date(createTimeEnd);
  //   if (createTimeStart && createTimeEnd) {
  //     this.logger.log(`search from ${createDateStart} to ${createDateEnd}`);
  //     return this.enterpriseMemberModel.find({
  //       createdAt: { $gte: createDateStart, $lte: createDateEnd }
  //     });
  //   } else if (createTimeStart && !createTimeEnd) {
  //     return this.enterpriseMemberModel.find({
  //       createdAt: { $gte: createDateStart }
  //     });
  //   } else if (!createTimeStart && createTimeEnd) {
  //     return this.enterpriseMemberModel.find({
  //       createdAt: { $lte: createDateEnd }
  //     });
  //   } else {
  //     return this.enterpriseMemberModel.find();
  //   }
  // }

  // async queryByApprovalStatus(
  //   approvalStatus: number
  // ): Promise<EnterpriseMemberDocument[]> {
  //   if (approvalStatus != -1) {
  //     return await this.enterpriseMemberModel.find({
  //       approvalStatus: approvalStatus
  //     });
  //   } else {
  //     return await this.enterpriseMemberModel.find();
  //   }
  // }
}

interface ConditionObject {
  [key: string]: any;
}

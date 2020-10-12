import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockInfoController } from './blockInfo.controller';
import { BlockInfoSchema } from './blockInfo.model';
import { BlockInfoService } from './blockInfo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'BlockInfo', schema: BlockInfoSchema }])
  ],
  controllers: [BlockInfoController],
  providers: [BlockInfoService],
  exports: [BlockInfoService]
})
export class BlockInfoModule {}

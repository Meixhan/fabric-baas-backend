import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockInfoController } from './block-info.controller';
import { BlockInfoSchema } from './block-info.schema';
import { BlockInfoService } from './block-info.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'BlockInfo', schema: BlockInfoSchema }])
  ],
  controllers: [BlockInfoController],
  providers: [BlockInfoService],
  exports: [BlockInfoService]
})
export class BlockInfoModule {}

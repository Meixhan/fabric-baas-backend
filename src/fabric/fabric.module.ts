import { FabricService } from './fabric.service';
import { FabricController } from './fabric.controller';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockInfoModule } from 'src/blockInfo/blockInfo.module';

@Module({
  imports: [ScheduleModule.forRoot(), BlockInfoModule],
  controllers: [FabricController],
  providers: [FabricService]
})
export class FabricModule {}

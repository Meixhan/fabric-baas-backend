import { FabricService } from './fabric.service';
import { FabricController } from './fabric.controller';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockInfoModule } from 'src/block-info/block-info.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [ScheduleModule.forRoot(), BlockInfoModule, TransactionModule],
  controllers: [FabricController],
  providers: [FabricService]
})
export class FabricModule {}

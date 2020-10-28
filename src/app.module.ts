import { EnterpriseMemberModule } from './enterprise-member/enterprise-member.module';
import { TransactionModule } from './transaction/transaction.module';
import { BlockInfoModule } from './block-info/block-info.module';
import { FabricModule } from './fabric/fabric.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/keys';

@Module({
  imports: [
    EnterpriseMemberModule,
    TransactionModule,
    BlockInfoModule,
    TransactionModule,
    FabricModule,
    MongooseModule.forRoot(config.mongoURI)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

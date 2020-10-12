import { BlockInfoModule } from './blockInfo/blockInfo.module';
import { FabricModule } from './fabric/fabric.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/keys';

@Module({
  imports: [
    BlockInfoModule,
    FabricModule,
    MongooseModule.forRoot(config.mongoURI)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

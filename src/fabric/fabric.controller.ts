import { Controller, Get, Logger } from '@nestjs/common';
import { FabricService } from './fabric.service';

@Controller('fabric')
export class FabricController {
  private readonly logger = new Logger(FabricController.name);

  constructor(private readonly fabricService: FabricService) {}

  @Get('/channelDetails')
  getChannelDetails() {
    return this.fabricService.getChannelDetails();
  }

  @Get('/genesisBlock')
  getGenesisBlock() {
    const block = this.fabricService.getGenesisBlock();
    this.logger.log(block);
    return block;
  }
}

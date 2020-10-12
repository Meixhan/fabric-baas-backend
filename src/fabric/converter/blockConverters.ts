import { BlockInfo } from 'src/blockInfo/blockInfo.model';
import {
  generateBlockHash,
  jsonObjSize
} from '../client/fabric/utils/FabricUtils';
import { Block } from '../model/block.model';

export async function convertBlockToDBItem(block: Block, channel_genesis_hash) {
  const blockRow: BlockInfo = {
    number: block.header.number,
    dataHash: block.header.data_hash.toString('hex'),
    previousHash: block.header.previous_hash.toString('hex'),
    txCount: block.data.data.length,
    blockHash: await generateBlockHash(block.header),
    prevBlockHash: '',
    blockSize: jsonObjSize(block),
    channelGenesisHash: channel_genesis_hash
  };
  return blockRow;
}

import { IsNumber } from 'class-validator';

// export interface BlockInfo {
//   number: number;
//   dataHash: string;
//   previousHash: string;
//   txCount: number;
//   blockHash: string;
//   prevBlockHash: string;
//   blockSize: string;
//   channelGenesisHash: string;
//   channelName: string;
// }

// we need this DTO to be a class for validation purpose
export class BlockRange {
  @IsNumber()
  low: number;

  @IsNumber()
  high: number;

  channelGenesisHash: string;
}

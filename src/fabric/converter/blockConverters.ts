import { BlockInfo, BlockInfoDocument } from 'src/block-info/block-info.schema';
import {
  generateBlockHash,
  jsonObjSize
} from '../client/fabric/utils/FabricUtils';
import { Block } from '../model/block.model';
import { ChaincodeActionPayload } from '../model/chaincode-action-payload.model';

export async function convertBlockToDBItem(
  block: Block,
  channel_genesis_hash: string,
  prev_block_hash: string
) {
  const blockRow: BlockInfo = {
    number: block.header.number,
    dataHash: block.header.data_hash.toString('hex'),
    previousHash: block.header.previous_hash.toString('hex'),
    txCount: block.data.data.length,
    blockHash: await generateBlockHash(block.header),
    prevBlockHash: prev_block_hash,
    blockSize: jsonObjSize(block),
    channelGenesisHash: channel_genesis_hash,
    channelName: block.data.data[0].payload.header.channel_header.channel_id,
    tip: null
  };
  return blockRow;
}

export async function convertTransactionToDBItem(block: Block) {
  const leagueName: string = '数研院';
  const transactions = block.data.data;
  let transactionList = [];
  for (let i = 0; i < transactions.length; i++) {
    const payloadData = transactions[i].payload.data;
    // const transactionRow: Transaction = {
    //   blockHash: await generateBlockHash(block.header),
    //   chainCodeId: null,
    //   chainCodeName: getChainCodeName(payloadData),
    //   channelId: 1,
    //   channelName: transactions[i].payload.header.channel_header.channel_id,
    //   createdAt: transactions[i].payload.header.channel_header.timestamp,
    //   isValid: 1,
    //   showDataRole: false,
    //   txArgs: getTxArgs(payloadData),
    //   txEndorseMsp: getTxEndorseMsp(payloadData),
    //   txMsp: transactions[i].payload.header.signature_header.creator.mspid,
    //   txId: transactions[i].payload.header.channel_header.tx_id,
    //   leagueName: leagueName
    // };
    const blockHash: string = await generateBlockHash(block.header);
    const chainCodeId = null;

    const channelId = 1;
    const channelName: string =
      transactions[i].payload.header.channel_header.channel_id;
    const createdAt: string =
      transactions[i].payload.header.channel_header.timestamp;
    const isValid = 1;
    const showDataRole = false;
    const txMsp: string =
      transactions[i].payload.header.signature_header.creator.mspid;
    const txId: string = transactions[i].payload.header.channel_header.tx_id;
    let chainCodeName = '';
    let txArgs = [];
    let txEndorseMsp = [];
    if (payloadData.actions) {
      const chaincodeActionPayload: ChaincodeActionPayload =
        payloadData.actions[0].payload;
      chainCodeName = getChainCodeName(chaincodeActionPayload);
      txArgs = getTxArgs(chaincodeActionPayload);
      txEndorseMsp = getTxEndorseMsp(chaincodeActionPayload);
    }

    const transactionRow = new TransactionRow(
      blockHash,
      chainCodeId,
      chainCodeName,
      channelId,
      channelName,
      createdAt,
      isValid,
      showDataRole,
      txArgs,
      txEndorseMsp,
      txMsp,
      txId,
      leagueName
    );
    transactionList.push(transactionRow);
  }

  return transactionList;
}

function getChainCodeName(chaincodeActionPayload: ChaincodeActionPayload) {
  return chaincodeActionPayload.chaincode_proposal_payload.input.chaincode_spec
    .chaincode_id.name;
}

function getTxArgs(chaincodeActionPayload: ChaincodeActionPayload) {
  const argNum =
    chaincodeActionPayload.chaincode_proposal_payload.input.chaincode_spec.input
      .args.length;
  let args = [];
  if (argNum) {
    for (let i = 0; i < argNum; i++) {
      args.push(
        Buffer.from(
          chaincodeActionPayload.chaincode_proposal_payload.input.chaincode_spec
            .input.args[i]
        ).toString('utf8')
      );
    }
  }
  return args;
}

function getTxEndorseMsp(chaincodeActionPayload: ChaincodeActionPayload) {
  let txEndorseMsp = [];
  if (chaincodeActionPayload.action.endorsements) {
    const mspNum = chaincodeActionPayload.action.endorsements.length;
    for (let i = 0; i < mspNum; i++) {
      txEndorseMsp.push(
        chaincodeActionPayload.action.endorsements[i].endorser.mspid
      );
    }
  }
  return txEndorseMsp;
}

class TransactionRow {
  blockHash: string;
  chainCodeId: any;
  chainCodeName: string;
  channelId: number;
  channelName: string;
  createdAt: string;
  isValid: number;
  showDataRole: boolean;
  txArgs: any[];
  txEndorseMsp: any[];
  txMsp: string;
  txId: string;
  leagueName: string;
  constructor(
    blockHash: string,
    chainCodeId: any,
    chainCodeName: string,
    channelId: number,
    channelName: string,
    createdAt: string,
    isValid: number,
    showDataRole: boolean,
    txArgs: any[],
    txEndorseMsp: any[],
    txMsp: string,
    txId: string,
    leagueName: string
  ) {
    this.blockHash = blockHash;
    this.chainCodeId = chainCodeId;
    this.chainCodeName = chainCodeName;
    this.channelId = channelId;
    this.channelName = channelName;
    this.createdAt = createdAt;
    this.isValid = isValid;
    this.showDataRole = showDataRole;
    this.txArgs = txArgs;
    this.txEndorseMsp = txEndorseMsp;
    this.txMsp = txMsp;
    this.txId = txId;
    this.leagueName = leagueName;
  }
}

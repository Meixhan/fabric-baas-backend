export interface ChaincodeActionPayload {
  chaincode_proposal_payload: ChaincodeProposalPayload;
  action: Action;
}

export interface ChaincodeProposalPayload {
  input: Input;
}

export interface Input {
  chaincode_spec: ChaincodeSpec;
}

export interface ChaincodeSpec {
  type: number;
  typeSting: string;
  input: any;
  chaincode_id: any;
  timeout: any;
}

export interface Action {
  proposal_response_payload: any;
  endorsements: any[];
}

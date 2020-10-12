export interface Block {
  header: Header;
  data: any;
  metadata: any;
}

export interface Header {
  number: any;
  previous_hash: any;
  data_hash: any;
}

declare namespace App {
  type Currency = {
    [token: string]: number
  }

  type State = {
    best: DTO.Block | null
    tokens: DTO.Token[] | null
    abis: {
      [key: string]: any
    }

    price: {
      [symbol: string]: Currency
    }
  }
}
declare namespace DTO {
  type Account = {
    address: string,
    balance: string,
    energy: string,
    code: string | null,
    master: string | null,
    sponsor: string | null,
    txCount: number
  }

  type MoveIndex = {
    txIndex: number
    clauseIndex: number
    logIndex: number
  }
  type AccountTx = Tx & { meta: Meta }

  type AccountTxs = {
    count: number
    txs: AccountTx[]
  }
  type AccountTransfer = Transfer & { meta: Meta } & {
    moveIndex: MoveIndex
  }
  type AccountTransfers = {
    count: number
    transfers: AccountTransfer[]
  }
  type SignedBlocks = {
    count: number,
    blocks: Block[]
  }

  type Authority = {
    address: string,
    endorsor: string,
    identity: string,
    reward: string,
    listed: boolean,
    signed: number
  }

  type TokenBalance = {
    symbol: string
    balance: string
  }

  type AccountDetail = {
    account: Account
    authority: Authority | null
    tokens: TokenBalance[]
  }

  type Meta = {
    blockID: string
    blockNumber: number
    blockTimestamp: number
  }
  type Token = {
    name: string
    symbol: string
    decimals: number
    address: string
    icon: string
    desc: string
    imgUrl: string
    website?: string
    whitePaper?: string
    links?: {
      [key: string]: string
    }[]
  }
  type Output = {
    contractAddress: string | null
    events: []
    transfers: Transfer[]
  }
  type Transfer = {
    sender: string
    recipient: string
    amount: string
    symbol?: string
  }
  type Receipt = {
    txID: string
    txIndex: number
    gasUsed: number
    gasPayer: string
    paid: string
    reward: string
    reverted: boolean
    outputs: Output[]
  }
  type Clause = {
    to: string
    value: string
    data: string
  }
  type Tx = {
    txID: string
    txIndex: number
    chainTag: number
    blockRef: string
    expiration: number
    gasPriceCoef: number
    gas: number
    nonce: string
    dependsOn: string | null
    origin: string
    delegator: string | null
    size: number
    clauses: Clause[]
    receipt?: {
      reverted: boolean
    }
  }

  type TxDetail = {
    meta: Meta
    receipt: Receipt
    tx: Tx
    transfers: Transfer[]
  }

  type BlockTxs = {
    meta: Meta
    txs: Tx[]
  }

  type Block = {
    id: string
    number: number
    timestamp: number
    gasLimit: number
    gasUsed: number
    totalScore: number
    parentID: string
    txsRoot: string
    stateRoot: string
    receiptsRoot: string
    signer: string
    beneficiary: string
    isTrunk: boolean
    txCount: number
    txsFeatures: number
    score: number
    reward: string
    size: number
  }

  type BlockDetail = {
    prev: string | null
    next: string | null
    block: Block
  }
}

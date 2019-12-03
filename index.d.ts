declare namespace Exp {
  type State = {
    best: Block | null
    tokens: Token[] | null
    abis: {
      [key: string]: any
    }
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

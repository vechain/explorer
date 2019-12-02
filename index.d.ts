declare namespace Exp {
  type Meta = {
    blockID: string
    blockNumber: number
    blockTimestamp: number
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
  } & Tx

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
  } & Block
}

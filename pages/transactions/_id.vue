<template>
    <div>
        <template v-if="tx">
            <div class="my-3">
                <h3 class="d-inline-block mr-3">Transaction</h3>
                <h5 class="d-inline-block text-secondary">
                    <RevertedIcon v-if="tx.reverted" />
                    <span>{{tx.txID | shortID}}</span>
                    <template v-if="tx.blockNumber">
                        @
                        <nuxt-link
                            v-if="tx.blockNumber"
                            :to="{
                        name: 'blocks-id', params: {
                            id: tx.blockID
                        }
                    }"
                        >{{tx.blockNumber | numFmt}}</nuxt-link>
                    </template>
                </h5>
            </div>
            <b-nav class="border-0" tabs align="left">
                <b-nav-item
                    link-classes="border-0"
                    v-for="item in links"
                    :key="item.hash"
                    :active="$route.hash.includes(item.hash)"
                    active-class="active"
                    :to="item.hash"
                >{{item.text}}</b-nav-item>
            </b-nav>
            <div style="background-color: #fff" v-show="isMounted">
                <NuxtDynamic
                    :is="meta ? 'TxInfo' : 'TxUnpacking'"
                    :bestNum="bestNum"
                    v-show="tab === 'info'"
                    :tx="tx"
                    :transfers="transfers"
                />
                <TxClauses :clauseList="clauseList" v-show="tab.includes('clauses')" />
            </div>
        </template>
        <template v-else>
            <div class="my-3">
                <h3 class="d-inline-block mr-3">Sorry we cannot locate the transaction</h3>
                <ol class="pl-3 mt-3">
                    <li>If you have just submitted a transaction please refreshing this page after at least 30 seconds.</li>
                    <li>Please make sure the transaction is same as the explorer network.</li>
                    <li>If it still does not show up after 1 hour, please check with your sender/exchange/wallet/transaction provider for additional information.</li>
                </ol>

                <b-button
                    class="mt-3"
                    squared
                    variant="outline-primary"
                    :to="{name: 'index'}"
                >BACK TO HOMEPAGE</b-button>
            </div>
        </template>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import TxInfo from '@/components/TxInfo.vue'
import TxUnpacking from '@/components/TxUnpacking.vue'
import TxClauses from '@/components/TxClauses.vue'
import { Context } from '@nuxt/types'
import RevertedIcon from '@/components/RevertedIcon.vue'
@Component({
    head() {
        return {
            titleTemplate: `%s | Tx`
        }
    },
    validate({ params }) {
        return !!params.id && /^0x[0-9a-fA-F]{64}$/.test(params.id)
    },
    components: {
        TxInfo,
        TxClauses,
        RevertedIcon,
        TxUnpacking
    },
    async asyncData(ctx: Context) {
        const txDetail: DTO.TxDetail = await ctx.$svc.tx(ctx.params.id)
        return {
            txDetail
        }
    }
})
export default class Transaction extends Vue {
    isMounted = false
    txDetail: DTO.TxDetail | null = null
    beforeMount() {
        const temp = this.$route.hash.substr(1).toLowerCase()
        if (!(temp.includes('info') || temp.includes('clauses'))) {
            location.hash = '#info'
        }
    }

    mounted() {
        this.isMounted = true
    }

    @Watch('bestNum')
    async onBest() {
        if (this.txDetail &&
            (
                this.txDetail.tx.state === 'PENDING'
                ||
                (this.txDetail.receipt.reverted && this.txDetail.receipt.vmError === null)
            )
        ) {
            const t = await this.$svc.tx(this.txDetail.tx.txID)
            if (this.txDetail) {
                this.txDetail.transfers = t.transfers
                if(JSON.stringify(this.txDetail.receipt) !== JSON.stringify(t.receipt)) {
                    this.txDetail.receipt = t.receipt
                }
            } else {
                this.txDetail = t
            }
        } else {
            return
        }
    }

    get transfers() {
        return this.txDetail ? this.txDetail.transfers : null
    }

    get tx() {
        if (this.txDetail && this.txDetail.tx) {
            return {
                ...this.txDetail!.tx,
                ...(this.txDetail!.receipt ? this.txDetail!.receipt : {}),
                ...(this.txDetail!.meta ? this.txDetail!.meta : {})
            }
        } else {
            return null
        }
    }

    get outputs() {
        return this.txDetail!.receipt ? this.txDetail!.receipt.outputs : null
    }

    get clauseList() {
        return this.clauses
            ? this.clauses.map((item: DTO.Clause, index: number) => {
                  return {
                      ...item,
                      ...(this.outputs ? this.outputs[index] : {})
                  }
              })
            : []
    }

    get meta() {
        return this.txDetail ? this.txDetail.meta : null
    }

    get clauses() {
        return this.txDetail ? this.txDetail!.tx.clauses : null
    }

    get links() {
        return [
            {
                text: 'Info',
                hash: '#info'
            },
            {
                text: `Clauses(${this.clauseList.length})`,
                hash: '#clauses'
            }
        ]
    }

    get bestNum(): number {
        return this.$store.getters.bestNum
    }
    get tab() {
        const temp = this.$route.hash.substr(1).toLowerCase()
        if (temp.includes('info') || temp.includes('clauses')) {
            return temp
        } else {
            return 'info'
        }
    }
}
</script>

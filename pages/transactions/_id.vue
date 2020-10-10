<template>
    <div>
        <template v-if="tx">
            <div class="my-3">
                <h3 class="d-inline-block mr-3">Transaction</h3>
                <h5 class="d-inline-block text-secondary">
                    <RevertedIcon v-if="tx.reverted" />
                    <span>{{tx.txID | shortID}}</span>
                    @
                    <nuxt-link
                        :to="{
                        name: 'blocks-id', params: {
                            id: tx.blockID
                        }
                    }"
                    >{{tx.blockNumber | numFmt}}</nuxt-link>
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
                <TxInfo
                    :bestNum="best.number"
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
import { Vue, Component } from 'vue-property-decorator'
import TxInfo from '@/components/TxInfo.vue'
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
        return !!params.id
    },
    components: {
        TxInfo,
        TxClauses,
        RevertedIcon
    },
    async asyncData(ctx: Context) {
        const result: DTO.TxDetail = await ctx.$svc.tx(ctx.params.id)

        if (!result.tx) {
            return {
                tx: null
            }
        }

        const data = {
            tx: {},
            clauses: result.tx.clauses,
            outputs: result.receipt.outputs,
            transfers: result.transfers,
            meta: result.meta
        }
        Object.assign(data.tx, result.tx)
        Object.assign(data.tx, result.receipt)
        Object.assign(data.tx, result.meta)

        const params = ctx.params
        const links = [
            {
                text: 'Info',
                hash: '#info'
            },
            {
                text: `Clauses(${data.clauses.length})`,
                hash: '#clauses'
            }
        ]

        const clauseList = data.clauses.map((item: any, index: number) => {
            return {
                ...item,
                ...data.outputs[index]
            }
        })
        return { links, ...data, clauseList }
    }
})
export default class Transaction extends Vue {
    isMounted = false
    beforeMount() {
        const temp = this.$route.hash.substr(1).toLowerCase()
        if (!(temp.includes('info') || temp.includes('clauses'))) {
            location.hash = '#info'
        }
    }

    mounted() {
        this.isMounted = true
    }
    get best(): DTO.Block {
        return this.$store.state.best
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

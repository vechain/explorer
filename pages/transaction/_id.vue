<template>
    <div>
        <div class="my-3">
            <h3 class="d-inline-block mr-3">Transaction</h3>
            <h5 class="d-inline-block text-secondary">
                <span>{{tx.txID | shortID}}</span>
                @
                <nuxt-link
                    :to="{
                        name: 'block-id', params: {
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
                exact
                replace
                exact-active-class="active"
                :to="item.hash"
            >{{item.text}}</b-nav-item>
        </b-nav>
        <div style="background-color: #fff" v-show="isMounted">
            <TxInfo :bestNum="best.number" v-show="tab === 'info'" :tx="tx" :transfers="transfers" />
            <TxClauses :clauseList="clauseList" v-show="tab === 'clause'" />
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TxInfo from '@/components/TxInfo.vue'
import TxClauses from '@/components/TxClauses.vue'
import { Context } from '@nuxt/types'
@Component({
    components: {
        TxInfo,
        TxClauses
    },
    async asyncData(ctx: Context) {
        const result: DTO.TxDetail = await ctx.$svc.tx(ctx.params.id)

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
                hash: '#clause'
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
        const tabs = ['info', 'clause']
        const temp = this.$route.hash.substr(1).toLowerCase()
        if (!tabs.includes(temp)) {
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
        const tabs = ['info', 'clause']
        const temp = this.$route.hash.substr(1).toLowerCase()
        if (tabs.includes(temp)) {
            return temp
        } else {
            return tabs[0]
        }
    }
}
</script>

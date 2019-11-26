<template>
    <div>
        <h1>Transaction</h1>
        <b-nav tabs align="left">
            <b-nav-item
                v-for="item in links"
                :key="item.hash"
                exact
                replace
                exact-active-class="active"
                :to="item.hash"
            >{{item.text}}</b-nav-item>
        </b-nav>
        <TxInfo v-show="tab === 'info'" :tx="tx" :transfers="transfers"/>
        <TxClauses :clauseList="clauseList" v-show="tab === 'clause'" />
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TxInfo from '@/components/TxInfo.vue'
import TxClauses from '@/components/TxClauses.vue'
import { Context } from '@nuxt/types'
@Component(
    {
        middleware: 'txInfo',
        components: {
            TxInfo,
            TxClauses
        },
        async fetch(ctx: Context) {
            const result = await ctx.$axios.$get(`https://vechain.github.io/token-registry/main.json`)
            ctx.store.commit('setTokens', result)
        },
        async asyncData(ctx: Context) {
            const params = ctx.params
            const links = [{
                text: 'Info',
                hash: '#info'
            }, {
                text: `Clause(${ctx.payload.clauses.length})`,
                hash: '#clause'
            }]
            const data = ctx.payload
            const clauseList = data.clauses.map((item: any, index: number) => {
                return {
                    ...item,
                    ...data.outputs[index]
                }
            })

            return { links, ...data, clauseList }
        }
    }
)
export default class Transaction extends Vue {
    beforeMount() {
        const tabs = ['info', 'clause']
        const temp = this.$route.hash.substr(1).toLowerCase()
        if (!tabs.includes(temp)) {
            location.hash = '#info'
        }
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

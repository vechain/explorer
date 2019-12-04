<template>
    <b-container class="mt-4">
        <b-row>
            <b-col cols="lg-6">
                <h5 class="ml-3">
                    Recent Blocks
                    <b-spinner v-if="!recentBlocks" type="grow" small class="ml-3" />
                </h5>
                <b-list-group class="shadow-sm" v-if="recentBlocks">
                    <transition-group tag="div" name="stack" class="position-relative">
                        <b-list-group-item
                            v-for="b in recentBlocks"
                            :key="b.id"
                            class="stack-item"
                        >
                            <b-row no-gutters>
                                <b-col cols="5">
                                    <div>
                                        Block #
                                        <router-link
                                            class="text-monospace"
                                            :to="{name:'block-id', params: {id: b.id}}"
                                        >{{b.number | numFmt}}</router-link>
                                    </div>
                                    <div
                                        class="text-muted small text-truncate"
                                    >{{b.timestamp | ago}}</div>
                                </b-col>
                                <b-col cols="3">
                                    <div>{{b.txCount}} Txs</div>
                                    <div class="small text-monospace">{{b.gasUsed | numFmt}} Gas</div>
                                </b-col>
                                <b-col cols="4" title="Signer" class="text-right small">
                                    <span class="text-secondary">Signer</span>
                                    <AccountLink :address="b.signer" :icon="false" />
                                </b-col>
                            </b-row>
                        </b-list-group-item>
                    </transition-group>
                </b-list-group>
            </b-col>
            <b-col cols="lg-6">
                <h5 class="ml-3 mt-lg-0 mt-sm-3 mt-2">
                    Recent Transactions
                    <b-spinner v-if="!recentTxs" type="grow" small class="ml-3" />
                </h5>
                <b-list-group class="shadow-sm" v-if="recentTxs" >
                    <transition-group tag="div" class="position-relative" name="stack">
                        <b-list-group-item
                            style="font-size:95%"
                            v-for="(t) in recentTxs"
                            :key="t.txID"
                            class="stack-item"
                        >
                            <b-row>
                                <b-col cols="7" class="text-truncate">
                                    TXID:
                                    <TxLink :id="t.txID" :short="false" />
                                </b-col>
                                <b-col cols="5" class="text-right">
                                    Origin
                                    <AccountLink :icon="false" :address="t.origin" />
                                </b-col>
                            </b-row>
                            <div>
                                <span class="text-muted small">{{t.meta.blockTimestamp | ago}}</span>
                                <Amount
                                    class="float-right"
                                    :amount="t.clauses | countVal"
                                    sym="VET"
                                />
                            </div>
                        </b-list-group-item>
                    </transition-group>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import AccountLink from '@/components/AccountLink.vue'
import IdentBox from '@/components/IdentBox.vue'
import Amount from '@/components/Amount.vue'
import TxLink from '@/components/TxLink.vue'
@Component({
    components: {
        IdentBox,
        AccountLink,
        Amount,
        TxLink
    },
    async asyncData(ctx: Context) {
        const result = await ctx.$axios.$get(`/api/blocks/recent`, {
            params: {
                limit: 10
            }
        })
        const txs = await ctx.$axios.$get(`/api/transactions/recent`, {
            params: {
                limit: 10
            }
        })
        return { recentBlocks: result.blocks, recentTxs: txs.txs }
    }
})
export default class App extends Vue {
    recentBlocks: any[] = []
    recentTxs: any[] = []
    loading = false
    timer: any = null

    getRecents() {
        this.$axios.$get(`/api/blocks/recent`, {
            params: {
                limit: 10
            }
        }).then(r => {
            this.recentBlocks = r.blocks
        })
        this.$axios.$get(`/api/transactions/recent`, {
            params: {
                limit: 10
            }
        }).then((r: {txs: Exp.Tx[]}) => {
            this.recentTxs = r.txs
        })
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.getRecents()
        }, 10000)
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }

    mounted() {
        this.loading = false
        this.startTimer()
    }

    beforeDestroy() {
        this.clearTimer()
    }
}
</script>
<style scoped>
.stack-item {
    transition: all 0.6s;
    transition-timing-function: ease;
}
.stack-enter {
    transform: scale(0.5, 0);
    transform-origin: 50% 0%;
    opacity: 0;
}
.stack-leave-active {
    position: absolute;
    left: 0px;
    right: 0px;
}
.stack-leave-to {
    opacity: 0;
}
</style>

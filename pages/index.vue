<template>
    <b-container class="mt-4">
        <b-row no-gutters>
            <b-col lg="6" class="px-0 px-sm-3">
                <h5 class="ml-3">
                    Recent Blocks
                    <b-spinner v-if="!recentBlocks" type="grow" small class="ml-3" />
                </h5>
                <b-list-group class="shadow-sm" v-if="recentBlocks">
                    <transition-group tag="div" name="stack" class="position-relative">
                        <b-list-group-item v-for="b in recentBlocks" :key="b.id" class="stack-item">
                            <b-row no-gutters>
                                <b-col
                                    cols="sm-5"
                                    class="d-flex d-sm-block justify-content-between"
                                >
                                    <div class="d-flex d-sm-block">
                                        Block #
                                        <router-link
                                            class="text-monospace"
                                            :to="{name:'blocks-id', params: {id: b.id}}"
                                        >{{b.number | numFmt}}</router-link>
                                    </div>
                                    <div
                                        class="d-flex d-sm-block text-muted small text-truncate"
                                    >{{b.timestamp | ago}}</div>
                                </b-col>
                                <b-col
                                    cols="sm-3"
                                    class="d-flex d-sm-block justify-content-between"
                                >
                                    <div class="d-flex d-sm-block">{{b.txCount}} Txs</div>
                                    <div
                                        class="d-flex d-sm-block small text-monospace"
                                    >{{b.gasUsed | numFmt}} Gas</div>
                                </b-col>
                                <b-col
                                    cols="sm-4"
                                    title="Signer"
                                    class="text-right small d-flex d-sm-block justify-content-between"
                                >
                                    <span class="d-flex d-sm-inline text-secondary">Signer</span>
                                    <AccountLink
                                        class="d-flex d-sm-inline-block"
                                        :address="b.signer"
                                        :icon="false"
                                    />
                                </b-col>
                            </b-row>
                        </b-list-group-item>
                    </transition-group>
                </b-list-group>
            </b-col>
            <b-col lg="6" class="px-0 px-sm-3">
                <h5 class="ml-3 mt-lg-0 mt-sm-3 mt-2">
                    Recent Transactions
                    <b-spinner v-if="!recentTxs" type="grow" small class="ml-3" />
                </h5>
                <b-list-group class="shadow-sm" v-if="recentTxs">
                    <transition-group tag="div" class="position-relative" name="stack">
                        <b-list-group-item
                            style="font-size:95%"
                            v-for="(t) in recentTxs"
                            :key="t.txID"
                            class="stack-item"
                        >
                            <b-row>
                                <b-col cols="sm-7 d-flex d-sm-block flex-column">
                                    <div class="text-truncate">
                                        TXID:
                                        <TxLink :id="t.txID" :short="false" />
                                    </div>
                                    <span
                                        class="text-muted small"
                                    >{{t.meta.blockTimestamp | ago}}</span>
                                </b-col>
                                <b-col
                                    cols="sm-5"
                                    class="text-right flex-column mt-1  mt-sm-0 d-flex d-sm-block"
                                >
                                    <div class="d-sm-block text-left text-sm-right small">
                                        <span class=" text-secondary">Origin </span>
                                        <AccountLink :icon="false" :address="t.origin" />
                                    </div>
                                    <Amount
                                        class="d-sm-block"
                                        :amount="t.clauses | countVal"
                                        sym="VET"
                                    />
                                </b-col>
                            </b-row>
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
    layout: 'index',
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
        }).then((r: { txs: DTO.Tx[] }) => {
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

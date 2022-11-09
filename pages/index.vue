<template>
    <b-container class="mt-4">
        <b-row align-v="stretch" class="shadow-sm border py-2 bg-white mb-3 mx-0 mx-sm-3">
            <b-col lg="6" class="px-2 px-sm-3 align-self-center">
                <Status :infos="status" />
            </b-col>
            <b-col lg="6" class="px-0 px-sm-3 align-self-center">
                <div class="text-truncate text-muted ml-3 small mb-2">Bandwidth</div>
                <div style="height: 100px; text-align: center;">
                    <b-spinner v-show="!chartLoaded" type="grow" middle />
                    <BandwidthChart class="px-2" v-show="chartLoaded" @loaded="chartLoaded = true" />
                </div>
            </b-col>
        </b-row>
        <b-row no-gutters>
            <b-col lg="6" class="px-0 px-sm-3">
                <h5 class="ml-3">
                    Recent Blocks
                    <b-spinner v-if="!recentBlocks" type="grow" small class="ml-3" />
                </h5>
                <b-list-group class="shadow-sm" v-if="recentBlocks">
                    <transition-group tag="div" name="stack" class="position-relative">
                        <b-list-group-item v-for="b in recentBlocks" :key="b.id" class="stack-item item-height">
                            <b-row no-gutters>
                                <b-col cols="sm-5" class="d-flex d-sm-block justify-content-between">
                                    <div class="d-flex d-sm-block">
                                        Block
                                        <router-link :to="{ name: 'blocks-id', params: { id: b.id } }">{{  b.number |
                                        numFmt


                                            }}
                                        </router-link>
                                    </div>
                                    <div class="d-flex d-sm-block text-muted small text-truncate">{{  b.timestamp | ago 
                                        }}
                                    </div>
                                </b-col>
                                <b-col cols="sm-3" class="d-flex d-sm-block justify-content-between">
                                    <div class="d-flex d-sm-block">{{  b.txCount  }} Txs</div>
                                    <div class="d-flex d-sm-block small">
                                        <small v-b-tooltip.hover="tooltipGas(b.gasUsed, b.gasLimit)">{{  b.gasUsed /
                                        b.gasLimit
                                        | percent



                                            }} Used</small>
                                    </div>
                                </b-col>
                                <b-col cols="sm-4" title="Signer"
                                    class="text-right small d-flex d-sm-block justify-content-between">
                                    <span class="d-flex d-sm-inline text-secondary">Signer</span>
                                    <AccountLink class="d-flex d-sm-inline-block" :address="b.signer" :icon="false" />
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
                        <b-list-group-item v-for="(t) in recentTxs" :key="t.txID" class="stack-item item-height">
                            <b-row>
                                <b-col cols="sm-7 d-flex d-sm-block flex-column">
                                    <div class="text-truncate">
                                        TxID:
                                        <RevertedIcon v-if="t.reverted" />
                                        <TxLink :id="t.txID" :short="false" />
                                    </div>
                                    <span class="text-muted small">{{  t.timestamp | ago  }}</span>
                                </b-col>
                                <b-col cols="sm-5" class="text-right flex-column mt-1 mt-sm-0 d-flex d-sm-block">
                                    <div class="d-sm-block text-sm-right small">
                                        <span class="text-secondary">Origin</span>
                                        <AccountLink :icon="false" :address="t.origin" />
                                    </div>
                                    <Amount class="d-sm-block" :amount="t.totalValue" sym="VET" />
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
import RevertedIcon from '@/components/RevertedIcon.vue'
import Status from '@/components/Status.vue'
import BandwidthChart from '@/components/BandwidthChart.vue'
@Component({
    head() {
        return {
            titleTemplate: `%s | Home`
        }
    },
    components: {
        IdentBox,
        Status,
        AccountLink,
        Amount,
        TxLink,
        RevertedIcon,
        BandwidthChart
    },
    layout: 'index',
    async asyncData(ctx: Context) {
        const { blocks, txs, status } = await ctx.$svc.summary()
        return { recentBlocks: blocks, recentTxs: txs, status }
    }
})
export default class App extends Vue {
    recentBlocks: DTO.BlockSummary[] = []
    recentTxs: DTO.TxSummary[] = []
    status: DTO.Status | null = null
    timer: any = null
    chartLoaded = false

    getRecents() {
        this.$svc.summary().then(r => {
            this.recentBlocks = r.blocks
            this.recentTxs = r.txs
            this.status = r.status
        })
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.getRecents()
        }, 10000)
    }

    tooltipGas(gasUsed: string, gasLimit: string) {
        return Vue.filter('numFmt')(gasUsed) + ' / ' + Vue.filter('numFmt')(gasLimit)
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }

    mounted() {
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

<template>
    <b-container class="mt-4">
        <b-row>
            <b-col cols="6">
                <h5 class="ml-3">
                    Recent Blocks
                    <b-spinner v-if="!recentBlocks" type="grow" small class="ml-3" />
                </h5>
                <transition-group
                    tag="div"
                    name="stack"
                    class="position-relative"
                    v-if="recentBlocks"
                >
                    <b-card v-for="b in recentBlocks" :key="b.id">
                        <b-row no-gutters>
                            <b-col cols="5">
                                <div>
                                    Block #
                                    <router-link
                                        class="text-monospace"
                                        :to="{name:'block-id', params: {id: b.id}}"
                                    >{{b.number | numFmt}}</router-link>
                                </div>
                                <div class="text-muted small text-truncate">{{b.timestamp | ago}}</div>
                            </b-col>
                            <b-col cols="3">
                                <div>{{b.txCount}} Txs</div>
                                <div class="small text-monospace">{{b.gasUsed | numFmt}} Gas</div>
                            </b-col>
                            <b-col cols="4" title="Signer" class="text-right small">
                                <span class="text-secondary">Singer</span>
                                <AccountLink :address="b.signer" :icon="false" />
                            </b-col>
                        </b-row>
                    </b-card>
                </transition-group>
            </b-col>
            <b-col cols="6">
                <h5 class="ml-3">
                    Recent Transfers
                    <b-spinner v-if="!recentTransfers" type="grow" small class="ml-3" />
                </h5>
                <b-list-group v-if="recentTransfers" style="font-size:90%">
                    <transition-group tag="div" class="position-relative" name="stack">
                        <b-list-group-item
                            style="font-size:95%"
                            v-for="(t) in recentTransfers"
                            :key="t.id"
                            class="stack-item"
                        >
                            <b-row>
                                <b-col cols="7" class="text-truncate">
                                    TXID:
                                    <nuxt-link
                                        :to="{
                                            name: 'transaction-id',
                                            params: {
                                                id: t.txID
                                            },
                                            hash: '#info'
                                        }"
                                        class="text-monospace"
                                    >{{t.txID}}</nuxt-link>
                                </b-col>
                            </b-row>
                            <b-row class="align-items-center mt-2" no-gutters>
                                <b-col cols="5">
                                    <AccountLink :address="t.sender" size="sm" />
                                </b-col>
                                <b-col cols="2" class="justify-content-end">
                                    <font-awesome-icon small icon="arrow-right" />
                                </b-col>
                                <b-col cols="5" class="text-right">
                                    <AccountLink :address="t.recipient" size="sm" />
                                </b-col>
                            </b-row>
                            <div>
                                <span class="text-muted small">{{t.meta.blockTimestamp | ago}}</span>
                                <span class="float-right">
                                    <span class="text-monospace">{{t.amount | hexToVal | balance}}</span>
                                    <span class="text-secondary">{{t.token}}</span>
                                </span>
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
@Component({
    components: {
        IdentBox,
        AccountLink
    },
    async asyncData(ctx: Context) {
        const result = await ctx.$axios.$get(`/api/blocks/recent`, {
            params: {
                limit: 10
            }
        })
        const txs = await ctx.$axios.$get(`/api/transfers/recent`, {
            params: {
                limit: 10
            }
        })
        return { recentBlocks: result.blocks, recentTransfers: txs.transfers }
    }
})
export default class App extends Vue {

}
</script>

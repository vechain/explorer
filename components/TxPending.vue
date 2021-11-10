<template>
    <div>
        <b-list-group flush>
            <ListItem>
                <template slot="label">Status</template>
                <template slot="item-content">
                    <div class="d-flex align-items-center">
                        <b-badge class="mr-2" variant="info">Pending</b-badge>
                    </div>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">ID</template>
                <template slot="item-content">
                    <span class="text-monospace font-weight-lighter">{{tx.txID}}</span>
                    <b-tooltip :triggers="[]" target="tx-id-btn" ref="tx-id-btn-tip">Copied</b-tooltip>
                    <b-button
                        id="tx-id-btn"
                        v-clipboard:copy="tx.txID"
                        v-clipboard:success="onCopy"
                        class="ml-1 ml-sm-3"
                        size="sm"
                        variant="outline-secondary"
                    >
                        <font-awesome-icon small icon="copy" />
                    </b-button>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Clauses</template>
                <template slot="item-content">
                    <b-button
                        to="#clauses"
                        size="sm"
                        variant="outline-primary"
                    >{{tx.clauses.length}}</b-button>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Total Transfer</template>
                <template slot="item-content">
                    <Amount :amount="tx.clauses | countVal" sym="VET" />
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Gas</template>
                <template slot="item-content">
                    <span class="text-monospace">{{tx.gas | numFmt}}</span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Gas Price Coef</template>
                <template slot="item-content">
                    <span>{{tx.gasPriceCoef}}</span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Origin</template>
                <template slot="item-content">
                    <AccountLink :address="tx.origin" :short="false" />
                </template>
            </ListItem>

            <template v-if="isMore">
                <ListItem>
                    <template slot="label">Size</template>
                    <template slot="item-content">{{tx.size}} B</template>
                </ListItem>
                <ListItem>
                    <template slot="label">BlockRef</template>
                    <template slot="item-content">
                        <span class="text-monospace font-weight-lighter">
                            <nuxt-link
                                :to="{name: 'search', query: {content: blcokRefNum(tx.blockRef)}}"
                            >{{tx.blockRef | bNum | numFmt}}</nuxt-link>
                        </span>
                        <span class="text-monospace font-weight-lighter">({{tx.blockRef}})</span>
                    </template>
                </ListItem>
                <ListItem>
                    <template slot="label">Expiration</template>
                    <template slot="item-content">{{tx.expiration}}</template>
                </ListItem>
                <ListItem>
                    <template slot="label">Nonce</template>
                    <template slot="item-content">
                        <span class="text-monospace font-weight-lighter">{{tx.nonce}}</span>
                    </template>
                </ListItem>
                <ListItem>
                    <template slot="label">Depends On</template>
                    <template slot="item-content">
                        <TxLink :short="false" v-if="tx.dependsOn" :id="tx.dependsOn" />
                        <span v-else>-</span>
                    </template>
                </ListItem>
                <ListItem>
                    <template slot="label">Chain Tag</template>
                    <template slot="item-content">
                        <span
                            class="text-monospace font-weight-lighter"
                        >0x{{tx.chainTag.toString(16)}}</span>
                    </template>
                </ListItem>
            </template>
            <b-list-group-item class="pl-1">
                <b-button
                    size="sm"
                    variant="link"
                    @click="isMore = !isMore"
                >View {{ isMore ? 'less' : 'more'}}</b-button>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ListItem from '@/components/ListItem.vue'
import IdentBox from '@/components/IdentBox.vue'
import AccountLink from '@/components/AccountLink.vue'
import TxLink from '@/components/TxLink.vue'
import TokenTransferItem from '@/components/TokenTransferItem.vue'
import Amount from '@/components/Amount.vue'
import { Context } from '@nuxt/types'
@Component({
    components: {
        ListItem,
        IdentBox,
        TokenTransferItem,
        AccountLink,
        Amount,
        TxLink
    }
})
export default class TxInfo extends Vue {
    @Prop(Object)
    tx!: DTO.Tx

    @Prop(Number)
    bestNum!: number

    showTip = false
    isMore = false

    blcokRefNum(blockRef: string) {
        return Vue.filter('bNum')(blockRef)
    }

    onCopy() {
        console.log(this.tx)
        const t = this.$refs['tx-id-btn-tip'] as Vue
        t.$emit('open')
        setTimeout(() => {
            t.$emit('close')
        }, 1000)
    }
}
</script>

<template>
    <div>
        <b-list-group flush>
            <ListItem>
                <template slot="label">Block Number</template>
                <template slot="item-content">
                    <b-button
                        :disabled="!prev"
                        size="sm"
                        variant="outline-secondary"
                        :to="{name: 'block-id', params: {
                        id: prev
                    }}"
                    >
                        <font-awesome-icon icon="arrow-left" />
                    </b-button>
                    <span class="align-middle mx-2 text-monospace">{{item.number | numFmt}}</span>
                    <b-button
                        :disabled="!next"
                        size="sm"
                        variant="outline-secondary"
                        :to="{name: 'block-id', params: {
                        id: next
                    }}"
                    >
                        <font-awesome-icon icon="arrow-right" />
                    </b-button>
                    <small
                        class="ml-2 align-middle text-muted text-secondary"
                    >@ {{item.timestamp | datetime}}</small>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">ID</template>
                <template slot="item-content">
                    <span class="text-monospace">{{item.id}}</span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Transactions</template>
                <template slot="item-content">
                    <b-button
                        :to="{name: 'block-id-txs', params: { id: $route.params.id }}"
                        size="sm"
                        variant="outline-primary"
                    >{{item.txCount}}</b-button>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Gas Used</template>
                <template slot="item-content">
                    <span class="text-monospace">
                        {{item.gasUsed | numFmt}}/{{item.gasLimit | numFmt}}
                        <small>({{item.gasUsed/item.gasLimit | percent}} Used)</small>
                    </span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Total Score</template>
                <template slot="item-content">
                    <span class="text-monospace">{{item.totalScore | numFmt}}</span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Signer</template>
                <template slot="item-content">
                    <AccountLink :address="item.signer" :short="false" />
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Beneficiary</template>
                <template slot="item-content">
                    <AccountLink :address="item.beneficiary" :short="false" />
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Rewards</template>
                <template slot="item-content">
                    <Amount :amount="item.reward" sym="VTHO" />
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Size</template>
                <template slot="item-content">{{item.size}} B</template>
            </ListItem>
            <ListItem>
                <template slot="label">Feature</template>
                <template slot="item-content">
                    <span v-if="item.txsFeatures === 0">-</span>
                    <span v-if="item.txsFeatures === 1">
                        Support
                        <b-badge variant="info">VIP191</b-badge>
                    </span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">State Root</template>
                <template slot="item-content">
                    <span class="text-monospace font-weight-lighter">{{item.stateRoot}}</span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Txs Root</template>
                <template slot="item-content">
                    <span class="text-monospace font-weight-lighter">{{item.txsRoot}}</span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Receipts Root</template>
                <template slot="item-content">
                    <span class="text-monospace font-weight-lighter">{{item.receiptsRoot}}</span>
                </template>
            </ListItem>
        </b-list-group>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ListItem from '@/components/ListItem.vue'
import AccountLink from '@/components/AccountLink.vue'
import IdentBox from '@/components/IdentBox.vue'
import Amount from '@/components/Amount.vue'
import { Context } from '@nuxt/types'
@Component({
    components: {
        ListItem,
        IdentBox,
        AccountLink,
        Amount
    },
    async asyncData(ctx: Context) {
        return {
            item: ctx.payload.block,
            next: ctx.payload.next,
            prev: ctx.payload.prev
        }
    }
})
export default class BlockInfo extends Vue {

}
</script>

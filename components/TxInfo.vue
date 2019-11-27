<template>
    <div>
        <b-list-group flush>
            <ListItem>
                <template slot="label">Status</template>
                <template slot="item-content"></template>
            </ListItem>
            <ListItem>
                <template slot="label">ID</template>
                <template slot="item-content">
                    <span class="text-monospace font-weight-lighter">{{tx.txID}}</span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Timestamp</template>
                <template slot="item-content">{{tx.blockTimestamp | datetime}}</template>
            </ListItem>
            <ListItem>
                <template slot="label">Total Transfer</template>
                <template slot="item-content">
                    <Amount :amount="tx.clauses | countVal" sym="VET" />
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Gas Used</template>
                <template slot="item-content"> <span class="text-monospace">{{tx.gasUsed}}</span></template>
            </ListItem>
            <ListItem>
                <template slot="label">Origin</template>
                <template slot="item-content">
                    <AccountLink :address="tx.origin" :short="false"/>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Fee</template>
                <template slot="item-content">
                    <Amount :amount="tx.paid" sym="VTHO" />
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Token Transferred</template>
                <template slot="item-content">
                    <ul class="ul mb-0 pl-0">
                        <li v-for="(item, i) in transfersList" :key="i">
                            <TokenTransferItem :origin="tx.origin" :transfer="item" /> 
                        </li>
                    </ul>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Size</template>
                <template slot="item-content">{{tx.size}}</template>
            </ListItem>
            <ListItem>
                <template slot="label">Reward</template>
                <template slot="item-content">
                    <Amount :amount="tx.reward" sym="VTHO" />
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">BlockRef</template>
                <template slot="item-content">
                    <span class="text-monospace font-weight-lighter">{{tx.blockRef}}</span>
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
                    <span class="text-monospace font-weight-lighter">{{tx.dependsOn}}</span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Chain Tag</template>
                <template slot="item-content">
                    <span class="text-monospace font-weight-lighter">{{tx.chainTag}}</span>
                </template>
            </ListItem>
        </b-list-group>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ListItem from '@/components/ListItem.vue'
import IdentBox from '@/components/IdentBox.vue'
import AccountLink from '@/components/AccountLink.vue'
import TokenTransferItem from '@/components/TokenTransferItem.vue'
import Amount from '@/components/Amount.vue'
import { Context } from '@nuxt/types'
@Component({
    components: {
        ListItem,
        IdentBox,
        TokenTransferItem,
        AccountLink,
        Amount
    }
})
export default class TxInfo extends Vue {
    @Prop(Object)
    tx!: Object

    @Prop()
    transfers!: any[]

    get transfersList() {
        return this.transfers.map(item => {
            return {
                sender: item.sender,
                recipient: item.recipient,
                amount: item.amount,
                symbol: item.symbol
            }
        })
    }
}
</script>
<style scoped>
.ul {
    list-style: none;
}
</style>



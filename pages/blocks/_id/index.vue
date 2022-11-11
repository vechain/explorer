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
                        :to="{name: 'blocks-id', params: {
                        id: prev
                    }}"
                    >
                        <font-awesome-icon icon="arrow-left" />
                    </b-button>
                    <span class="align-middle mx-2">{{item.number | numFmt}}</span>
                    <b-button
                        :disabled="!next"
                        size="sm"
                        variant="outline-secondary"
                        :to="{name: 'blocks-id', params: {
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
                <template slot="label">Status</template>
                <template slot="item-content">
                    <b-badge v-if="item.isFinalized" class="mr-2" variant="primary">Finalized</b-badge>
                    <b-badge v-else class="mr-2" variant="secondary">Unfinalized</b-badge>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">ID</template>
                <template slot="item-content">
                    <span>{{item.id}}</span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Transactions</template>
                <template slot="item-content">
                    <b-button
                        :to="{name: 'blocks-id-txs', params: { id: item.id }}"
                        size="sm"
                        variant="outline-primary"
                    >{{item.txCount}}</b-button>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Gas Used</template>
                <template slot="item-content">
                    <span>
                        {{item.gasUsed | numFmt}}/{{item.gasLimit | numFmt}}
                        <small>({{item.gasUsed/item.gasLimit | percent}} Used)</small>
                    </span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Total Score</template>
                <template slot="item-content">
                    <span>{{item.totalScore | numFmt}} (+{{item.score}})</span>
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
            <template v-if="isMore">
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
                        <span>{{item.stateRoot}}</span>
                    </template>
                </ListItem>
                <ListItem>
                    <template slot="label">Txs Root</template>
                    <template slot="item-content">
                        <span>{{item.txsRoot}}</span>
                    </template>
                </ListItem>
                <ListItem>
                    <template slot="label">Receipts Root</template>
                    <template slot="item-content">
                        <span>{{item.receiptsRoot}}</span>
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
    }
})
export default class BlockInfo extends Vue {
    @Prop()
    blockDetail!: DTO.BlockDetail | null

    isMore = false

    get item() {
        return this.blockDetail ? this.blockDetail.block : {}
    }

    get next() {
        return this.blockDetail ? this.blockDetail.next : null
    }

    get prev() {
        return this.blockDetail ? this.blockDetail.prev : null
    }
}
</script>

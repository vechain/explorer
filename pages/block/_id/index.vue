<template>
    <div>
        <b-list-group flush>
            <ListItem>
                <template slot="label">Block Number</template>
                <template slot="item-content">
                    <b-button
                        size="sm"
                        variant="outline-secondary"
                        :to="{name: 'block-id-info', params: {
                        id: prev
                    }}"
                    >
                        <font-awesome-icon icon="arrow-left" />
                    </b-button>
                    <span class="align-middle text-monospace">{{item.number | numFmt}}</span>
                    <b-button
                        size="sm"
                        variant="outline-secondary"
                        :to="{name: 'block-id-info', params: {
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
                <template slot="label">Gas Used</template>
                <template slot="item-content">
                    <span class="text-monospace">{{item.gasUsed | numFmt}}</span>
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
                    <IdentBox
                        class="d-inline-block mr-2 rounded align-middle"
                        style="width: 55px; height: 30px"
                        :address="item.signer"
                    ></IdentBox>
                    <nuxt-link
                        class="text-monospace align-middle font-weight-lighter"
                        :to="{
                        name: 'account-id',
                        params: {
                            id: item.signer
                        }
                    }"
                    >
                        <span>{{item.signer}}</span>
                    </nuxt-link>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Beneficiary</template>
                <template slot="item-content">
                    <IdentBox
                        class="d-inline-block mr-2 rounded align-middle"
                        style="width: 55px; height: 30px"
                        :address="item.beneficiary"
                    ></IdentBox>
                    <nuxt-link
                        class="text-monospace align-middle font-weight-lighter"
                        :to="{
                        name: 'account-id',
                        params: {
                            id: item.beneficiary
                        }
                    }"
                    >
                        <span>{{item.beneficiary}}</span>
                    </nuxt-link>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Rewards</template>
                <template slot="item-content">{{item.reward}}</template>
            </ListItem>
            <ListItem>
                <template slot="label">Size</template>
                <template slot="item-content">{{item.size}}</template>
            </ListItem>
            <ListItem>
                <template slot="label">Feature</template>
                <template slot="item-content">{{item.txsFeatures}}</template>
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
import IdentBox from '@/components/IdentBox.vue'
import { Context } from '@nuxt/types'
@Component({
    middleware: 'blockInfo',
    components: {
        ListItem,
        IdentBox
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

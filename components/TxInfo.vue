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
                <template slot="item-content"></template>
            </ListItem>
            <ListItem>
                <template slot="label">Total Transfer</template>
                <template slot="item-content">
                    <span class="text-monospace">
                    {{tx.clauses | countVal | hexToVal | balance}}
                    <small class="text-secondary">VET</small>
                    </span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Gas Used</template>
                <template slot="item-content"></template>
            </ListItem>
            <ListItem>
                <template slot="label">Origin</template>
                <template slot="item-content">
                    <IdentBox
                        class="d-inline-block mr-2 rounded align-middle"
                        style="width: 55px; height: 30px"
                        :address="tx.origin"
                    ></IdentBox>
                    <nuxt-link
                        class="text-monospace align-middle font-weight-lighter"
                        :to="{name: 'account-id', params: {id: tx.origin}}"
                    >
                        <span>{{tx.origin}}</span>
                    </nuxt-link>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Fee</template>
                <template slot="item-content">
                    <span class="text-monospace"> 
                    {{tx.paid | hexToVal | balance}}
                    <small class="text-secondary">VEHO</small>
                    </span>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Size</template>
                <template slot="item-content">{{tx.size}}</template>
            </ListItem>
            <ListItem>
                <template slot="label">Reward</template>
                <template slot="item-content">
                    <span class="text-monospace">{{tx.reward | hexToVal | balance}}</span>
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
import { Context } from '@nuxt/types'
@Component({
    components: {
        ListItem,
        IdentBox
    }
})
export default class TxInfo extends Vue {
    @Prop(Object)
    tx!: Object
}
</script>

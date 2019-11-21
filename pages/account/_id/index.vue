<template>
    <div>
        <b-list-group flush>
            <ListItem>
                <template slot="label">Address</template>
                <template slot="item-content">
                    <div class="text-break">
                        <span
                            class="text-monospace font-weight-lighter"
                        >{{account.address | toChecksumAddress}}</span>
                    </div>
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">VET</template>
                <template slot="item-content">
                    <Balance :balance="account.balance" token="vet" />
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">VTHO</template>
                <template slot="item-content">
                    <Balance :balance="account.energy" token="vet" />
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Account Type</template>
                <template slot="item-content">
                    <b-badge class="text-light" pill variant="warning" v-if="account.code">Contract</b-badge>
                    <b-badge pill else>Regular</b-badge>
                    <b-badge pill variant="dark" v-if="account.isAuthority">Authority</b-badge>
                </template>
            </ListItem>
            <ListItem v-if="account.code">
                <template slot="label">Master</template>
                <template slot="item-content">{{account.master}}</template>
            </ListItem>
            <ListItem v-if="account.code">
                <template slot="label">Sponsor</template>
                <template slot="item-content"></template>
            </ListItem>
            <ListItem v-if="account.code">
                <template slot="label">Code</template>
                <template slot="item-content">{{account.code}}</template>
            </ListItem>
            <ListItem v-if="account.isAuthority">
                <template slot="label">Signed block</template>
                <template slot="item-content">{{account.signed}}</template>
            </ListItem>
            <ListItem v-if="account.isAuthority">
                <template slot="label">Block rewards</template>
                <template slot="item-content">
                    <span class="text-monospace">{{account.reward | hexToVal | balance}}</span>
                </template>
            </ListItem>
        </b-list-group>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ListItem from '@/components/ListItem.vue'
import Balance from '@/components/Balance.vue'
import { Context } from '@nuxt/types'
@Component({
    components: {
        ListItem,
        Balance
    },
    middleware: 'summary',
    async asyncData(ctx: Context) {

        return {
            ...ctx.payload
        }
    }
})
export default class Summary extends Vue {
}
</script>

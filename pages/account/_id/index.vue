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
                        <b-tooltip
                            :triggers="[]"
                            target="account-id-btn"
                            ref="account-id-btn-tip"
                        >Copied</b-tooltip>
                        <b-button
                            id="account-id-btn"
                            v-clipboard:copy="checksumAddress(account.address)"
                            v-clipboard:success="onCopy"
                            class="ml-3"
                            size="sm"
                            pill
                            variant="outline-secondary"
                        >
                            <font-awesome-icon small icon="copy" />
                        </b-button>
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
                    <Balance :balance="account.energy" token="vtho" />
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">Account Type</template>
                <template slot="item-content">
                    <b-badge class="text-light" pill variant="warning" v-if="account.code">Contract</b-badge>
                    <b-badge pill else>Regular</b-badge>
                    <b-badge pill variant="dark" v-if="authority">Authority</b-badge>
                </template>
            </ListItem>
            <ListItem v-if="token.length">
                <template slot="label">Tokens</template>
                <template slot="item-content">
                    <TokenItem
                        class="my-2"
                        :amount="item.balance"
                        :symbol="item.symbol"
                        v-for="(item, i) in token"
                        :key="i"
                    ></TokenItem>
                </template>
            </ListItem>
            <ListItem v-if="account.code">
                <template slot="label">Master</template>
                <template slot="item-content">
                    <AccountLink v-if="account.master" :address="account.master" :short="false" />
                    <span v-else>-</span>
                </template>
            </ListItem>
            <ListItem v-if="account.code">
                <template slot="label">Sponsor</template>
                <template slot="item-content">
                    <AccountLink v-if="account.sponsor" :address="account.sponsor" :short="false" />
                    <span v-else>-</span>
                </template>
            </ListItem>
            <ListItem v-if="account.code">
                <template slot="label">Code</template>
                <template slot="item-content">
                    <b-form-textarea
                        class="text-monospace"
                        readonly
                        v-model="account.code"
                        rows="3"
                        max-rows="8"
                    ></b-form-textarea>
                </template>
            </ListItem>
            <ListItem v-if="authority">
                <template slot="label">Signed block</template>
                <template slot="item-content">
                    <span class="text-monospace">{{authority.signed | numFmt}}</span>
                </template>
            </ListItem>
            <ListItem v-if="authority">
                <template slot="label">Block rewards</template>
                <template slot="item-content">
                    <Amount :amount="authority.reward" sym="VTHO" />
                </template>
            </ListItem>
        </b-list-group>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ListItem from '@/components/ListItem.vue'
import AccountLink from '@/components/AccountLink.vue'
import Balance from '@/components/Balance.vue'
import { Context } from '@nuxt/types'
import Amount from '@/components/Amount.vue'
import TokenItem from '@/components/TokenItem.vue'
@Component({
    components: {
        ListItem,
        AccountLink,
        Balance,
        Amount,
        TokenItem
    },
    async asyncData(ctx: Context) {
        const result = await ctx.$axios.$get('/api/accounts/' + ctx.params.id)
        return {
            ...result
        }
    }
})
export default class Summary extends Vue {
    isAuthority = false
    checksumAddress(addr: string) {
        return Vue.filter('toChecksumAddress')(addr)
    }
    getImgUrl(symbol: string) {
        const token: Exp.Token = this.$store.state.tokens.find((item: Exp.Token) => {
            return item.symbol === symbol
        })
        if (token) {
            return token.imgUrl
        }
    }
    mounted() {
        this.$emit('account-isAuthority', this.isAuthority)
    }
    onCopy() {
        const t = this.$refs['account-id-btn-tip'] as Vue
        t.$emit('open')
        setTimeout(() => {
            t.$emit('close')
        }, 1000)
    }
}
</script>

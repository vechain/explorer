<template>
    <div>
        <b-list-group flush>
            <ListItem>
                <template slot="label">Address</template>
                <template slot="item-content">
                    <div class="d-inline-block d-sm-flex align-items-center">
                        <IdentBox
                            class="d-inline-block mr-1 rounded align-middle"
                            style="width: 30px; height: 20px"
                            :address="account.address"
                        ></IdentBox>
                        <span
                            class="text-monospace font-weight-lighter"
                        >{{account.address | toChecksumAddress}}</span>
                        <b-tooltip
                            :triggers="[]"
                            target="accounts-id-btn"
                            ref="accounts-id-btn-tip"
                        >Copied</b-tooltip>
                        <b-button
                            id="accounts-id-btn"
                            v-clipboard:copy="checksumAddress(account.address)"
                            v-clipboard:success="onCopy"
                            class="ml-1 ml-sm-3"
                            size="sm"
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
            <ListItem v-if="account.master">
                <template slot="label">Master</template>
                <template slot="item-content">
                    <AccountLink
                        class="d-flex align-items-center"
                        :address="account.master"
                        :short="false"
                    />
                </template>
            </ListItem>
            <template v-if="isMore">
                <ListItem v-if="tokens.length">
                    <template slot="label">Tokens</template>
                    <template slot="item-content">
                        <TokenItem
                            class="my-2"
                            :amount="item.balance"
                            :symbol="item.symbol"
                            v-for="(item, i) in tokens"
                            :key="i"
                        ></TokenItem>
                    </template>
                </ListItem>
                <template v-if="account.code">
                    <ListItem v-if="account.sponsor">
                        <template slot="label">Sponsor</template>
                        <template slot="item-content">
                            <AccountLink
                                class="d-flex align-items-center"
                                :address="account.sponsor"
                                :short="false"
                            />
                        </template>
                    </ListItem>
                    <ListItem>
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
                </template>
                <template v-if="authority">
                    <ListItem>
                        <template slot="label">Endorsor</template>
                        <template slot="item-content">
                            <AccountLink
                                class="d-flex align-items-center"
                                v-if="authority.endorsor"
                                :address="authority.endorsor"
                                :short="false"
                            />
                            <span v-else>-</span>
                        </template>
                    </ListItem>
                    <ListItem>
                        <template slot="label">Signed blocks</template>
                        <template slot="item-content">
                            <span class="text-monospace">{{authority.signed | numFmt}}</span>
                        </template>
                    </ListItem>
                    <ListItem>
                        <template slot="label">Block rewards</template>
                        <template slot="item-content">
                            <Amount :amount="authority.reward" sym="VTHO" />
                        </template>
                    </ListItem>
                </template>
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
import Balance from '@/components/Balance.vue'
import { Context } from '@nuxt/types'
import IdentBox from '@/components/IdentBox.vue'
import Amount from '@/components/Amount.vue'
import TokenItem from '@/components/TokenItem.vue'
@Component({
    components: {
        ListItem,
        AccountLink,
        Balance,
        Amount,
        TokenItem,
        IdentBox
    }
})
export default class Summary extends Vue {
    @Prop()
    account!: object
    @Prop()
    authority!: object
    @Prop({ default: [] })
    tokens!: DTO.Token[]

    isMore = false

    checksumAddress(addr: string) {
        return Vue.filter('toChecksumAddress')(addr)
    }

    getImgUrl(symbol: string) {
        const token: DTO.Token = this.$store.state.tokens.find(
            (item: DTO.Token) => {
                return item.symbol === symbol
            }
        )
        if (token) {
            return token.imgUrl
        }
    }

    onCopy() {
        const t = this.$refs['accounts-id-btn-tip'] as Vue
        t.$emit('open')
        setTimeout(() => {
            t.$emit('close')
        }, 1000)
    }
}
</script>

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
                        <b-button
                            id="accounts-id-btn"
                            class="ml-1 ml-sm-3"
                            size="sm"
                            v-b-modal.account-qrcode
                            variant="outline-secondary"
                        >
                            <font-awesome-icon small icon="qrcode" />
                        </b-button>
                    </div>
                </template>
            </ListItem>
            <template v-if="extraInfo">
                <ListItem>
                    <template slot="label">Name</template>
                    <template slot="item-content">
                        <span>{{extraInfo.name}}</span>
                    </template>
                </ListItem>
                <ListItem>
                    <template slot="label">Symbol</template>
                    <template slot="item-content">
                        <span>{{extraInfo.symbol}}</span>
                    </template>
                </ListItem>
                <ListItem>
                    <template slot="label">Description</template>
                    <template slot="item-content">
                        <span>{{extraInfo.desc}}</span>
                    </template>
                </ListItem>
                <ListItem v-if="extraInfo.website">
                    <template slot="label">Website</template>
                    <template slot="item-content">
                        <a :href="extraInfo.website">{{extraInfo.website}}</a>
                    </template>
                </ListItem>
                <ListItem v-if="extraInfo.links">
                    <template slot="label">Website</template>
                    <template slot="item-content">
                        <template v-for="item in extraInfo.links">
                            <a v-for="(value, key) in item" :key="value" :href="value" target="_blank" class="mr-3 text-dark">
                                <font-awesome-icon :icon="['fab' , key ]" />
                            </a>
                        </template>
                    </template>
                </ListItem>
            </template>
            <ListItem>
                <template slot="label">VET</template>
                <template slot="item-content">
                    <Balance :balance="account.balance" token="VET" />
                </template>
            </ListItem>
            <ListItem>
                <template slot="label">VTHO</template>
                <template slot="item-content">
                    <Balance :balance="account.energy" token="VTHO" />
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
            <template v-if="extraInfo">
                <ListItem v-if="extraInfo.decimals">
                    <template slot="label">Decimals</template>
                    <template slot="item-content">
                        <span>{{extraInfo.decimals}}</span>
                    </template>
                </ListItem>
                <ListItem v-if="extraInfo.totalSupply">
                    <template slot="label">Total Supply</template>
                    <template slot="item-content">
                        <span>{{extraInfo.totalSupply}}</span>
                    </template>
                </ListItem>
            </template>
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
        </b-list-group>
        <b-modal
            header-class="border-bottom-0"
            id="account-qrcode"
            size="sm"
            :ok-only="true"
            :visible="qrShow"
            :centered="true"
            button-size="sm"
        >
            <template v-slot:modal-header>
                <div></div>
            </template>
            <qrcode class="m-auto" :size="200" :content="account.address | toChecksumAddress" />
        </b-modal>
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
    account!: any
    @Prop()
    authority!: object
    @Prop({ default: [] })
    tokens!: DTO.Token[]

    @Prop()
    extraInfo!: DTO.Token

    qrShow = false

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

    // mounted() {
    //     if (
    //         (this.account.code,
    //         this.$store.getters.tokenAddressList.includes(this.account.address))
    //     ) {
    //         this.extraInfo = this.$store.state.tokens.find(
    //             (item: DTO.Token) => {
    //                 return item.address === this.account.address
    //             }
    //         )
    //     }
    // }

    onCopy() {
        const t = this.$refs['accounts-id-btn-tip'] as Vue
        t.$emit('open')
        setTimeout(() => {
            t.$emit('close')
        }, 1000)
    }
}
</script>

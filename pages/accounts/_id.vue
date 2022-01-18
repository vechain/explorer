<template>
    <div>
        <div class="my-3">
            <div>
                <h3 class="d-inline-block mr-3">{{ title }}</h3>
                <h5
                    class="text-secondary d-inline-block"
                >{{ account.address | toChecksumAddress | shortAddress }}</h5>
            </div>
            <h6>
                <b-badge v-if="extraInfo" pill variant="info">{{ extraInfo.symbol}}</b-badge>
            </h6>
        </div>
        <b-nav class="border-0" tabs align="left">
            <b-nav-item
                link-classes="border-0"
                v-for="item in links"
                :key="item.route.name"
                :active="item.route.name === $route.name"
                :to="item.route"
            >{{ item.text }}</b-nav-item>
        </b-nav>
        <nuxt-child
            style="background-color: #fff"
            :account="account"
            :authority="authority"
            :tokens="tokens"
            :extraInfo="extraInfo"
        />
        <div v-if="$route.name.includes('transfer')" class="text-right">
            <span class="text-muted">Download</span>
            <b-link :to="{name: 'download', query: {address: account.address}}">CSV Export</b-link>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import { Route } from 'vue-router'
@Component({
    head() {
        return {
            titleTemplate: `%s | ${(this as Account).title}`
        }
    },
    validate({ params }) {
        return !!params.id && /^0x[0-9a-fA-F]{40}$/.test(params.id)
    },
    async asyncData(ctx: Context) {
        const params = ctx.params
        const result = await ctx.$svc.account(ctx.params.id)
        let tokenList = ctx.store.state.tokens
        if (!tokenList.length) {
            tokenList = await ctx.$svc.tokens()
            ctx.store.commit('setTokens', tokenList)
        }
        return {
            detail: result,
            tokenList,
            params
        }
    }
})
export default class Account extends Vue {
    detail: DTO.AccountDetail | null = null
    tokenList: DTO.Token[] | null = null
    params: any = null

    // by tokenList
    get extraInfo() {
        if (this.tokenList && this.account) {
            return (
                this.tokenList.find(item => {
                    return item.address === this.account!.address
                }) || null
            )
        } else {
            return null
        }
    }

    // by detail
    get title() {
        return this.account!.code
            ? 'Contract'
            : this.authority
            ? 'Authority'
            : 'Account'
    }
    get account() {
        return this.detail && this.detail.account
    }
    get authority() {
        return this.detail && this.detail.authority
    }
    get tokens() {
        return this.detail && this.detail.tokens
    }
    get links() {
        const links = [
            {
                text: 'Summary',
                route: {
                    name: 'accounts-id',
                    params: this.params
                }
            },
            {
                text: 'Transactions',
                route: {
                    name: 'accounts-id-txs',
                    params: this.params
                }
            },
            {
                text: 'Transfers',
                route: {
                    name: 'accounts-id-transfer',
                    params: this.params
                }
            }
        ]
        if (this.detail && this.detail.authority) {
            links.push({
                text: 'Signed Blocks',
                route: {
                    name: 'accounts-id-blocks',
                    params: this.params
                }
            })
        }
        return links
    }
}
</script>

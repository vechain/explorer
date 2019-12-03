<template>
    <div>
        <h3>Account</h3>
        <b-nav tabs align="left">
            <b-nav-item
                v-for="item in links"
                :key="item.route.name"
                replace
                :active="item.route.name === $route.name"
                :to="item.route"
            >{{item.text}}</b-nav-item>
        </b-nav>
        <nuxt-child />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import { Route } from 'vue-router'
@Component({
    async asyncData(ctx: Context) {
        const params = ctx.params
        const links = [{
            text: 'Summary',
            route: {
                name: 'account-id',
                params
            }
        }, {
            text: 'Transaction',
            route: {
                name: 'account-id-txs',
                params
            }
        }, {
            text: 'Transfer',
            route: {
                name: 'account-id-transfer',
                params
            }
        },{
            text: 'Signed Blocks',
            route: {
                name: 'account-id-blocks',
                params
            }
        }]

        return { links }
    }
})
export default class Account extends Vue {
}
</script>

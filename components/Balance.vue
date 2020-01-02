<template>
    <blockquote class="blockquote mb-0 balance">
        <p class="mb-0 text-monospace">
            <small>
                <nuxt-link
                    :to="{
                    name: 'accounts-id-transfer',
                    params: {
                        id: $route.params.id
                    },
                    query: {
                        token: token.toUpperCase()
                    }
            }"
                >
                    <Amount :amount="balance" :sym="token" />
                </nuxt-link>
            </small>
        </p>
        <footer v-if="isMainnet" class="blockquote-footer text-monospace">
            <small v-if="btc">{{ balance | calcBtc(btc) }} BTC</small>
            <small v-else>--</small>
        </footer>
    </blockquote>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Amount from '@/components/Amount.vue'
@Component({
    components: {
        Amount
    }
})
export default class Balance extends Vue {
    @Prop(String)
    balance!: string

    @Prop(String)
    token!: string

    isMainnet = (process.env['current'] || '').toLowerCase() === 'mainnet'

    get btc() {
        if (
            this.$store.state.price &&
            this.$store.state.price.btc &&
            this.$store.state.price.btc[this.token.toUpperCase()]
        ) {
            return this.$store.state.price.btc[this.token.toUpperCase()]
        } else {
            return 0
        }
    }
}
</script>
<style scoped>
.balance {
    line-height: 1.1;
}
.balance .blockquote-footer::before {
    content: '\2248';
}
</style>

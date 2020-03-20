<template>
    <b-row no-gutters align-content="start">
        <b-col cols="2" sm="1">
            <div :style="item.style" class="token-icon"></div>
        </b-col>
        <b-col align-self="center">
            <nuxt-link
                :to="{
                    name: 'accounts-id-transfer',
                    params: {
                        id: $route.params.id
                    },
                    query: {
                        token: symbol
                    }
            }"
            >
                <Amount :amount="amount" :sym="symbol" />
            </nuxt-link>
        </b-col>
    </b-row>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Amount from './Amount.vue'
@Component({
    components: {
        Amount
    }
})
export default class TokenItem extends Vue {
    @Prop(String)
    symbol!: string
    @Prop()
    amount!: string

    get item() {
        const temp: DTO.Token | null = this.$store.state.tokens.find(
            (item: DTO.Token) => {
                return item.symbol.toLowerCase() === this.symbol.toLowerCase()
            }
        )

        if (temp) {
            return {
                ...temp,
                style: {
                    'background-image': `url("${temp.imgUrl}")`
                }
            }
        } else {
            return {}
        }
    }
}
</script>
<style scope>
.token-icon {
    height: 40px;
    width: 40px;
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: center;
}
</style>

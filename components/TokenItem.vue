<template>
    <div class="d-flex">
        <div :style="item.style" class="token-icon d-flex d-inline-block"></div>
        <div class="pl-1 d-flex align-self-center">{{item.symbol}}</div>
        <div class="px-2 d-flex align-self-center">
          <span v-b-tooltip.hover :title="item.desc">
            <font-awesome-icon small color="#6c757d" icon="info-circle" />
          </span>
            <!-- <font-awesome-icon small icon="copy" /> -->
        </div>
        <div class="pl-4 d-flex align-self-center">
            <Amount :decimals="item.decimals" :amount="amount" :sym="symbol" />
        </div>
    </div>
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
        const temp: Exp.Token | null = this.$store.state.tokens.find((item: Exp.Token) => {
            return item.symbol.toLowerCase() === this.symbol.toLowerCase()
        })

        if (temp) {
            return {
                ...temp,
                style: {
                    'background-image': `url("${temp.imgUrl}")`,
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

<template>
    <span :class="{small: sm}">
        <span  class="text-monospace">{{amount | hexToVal(decimals) | balance}}</span>
        <small v-if="sym && showSym" class="text-secondary">{{sym}}</small>
    </span>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class Amount extends Vue {
    @Prop({ default: 0 })
    amount!: string | number

    @Prop({ default: '' })
    sym!: string

    @Prop({ default: true })
    showSym!: boolean


    @Prop({default:false})
    sm!: boolean

    get tokens() {
        if (this.$store.state.tokens) {
            return [{
                symbol: 'VET',
                decimals: 18,
                imgUrl: require('~/assets/vet.png')
            }].concat(this.$store.state.tokens)
        } else {
            return []
        }
    }

    get decimals() {
        const temp = this.tokens.find(item => {
            return item.symbol === this.sym
        })

        if (temp) {
            return temp.decimals
        } else {
            return 18
        }
    }
}
</script>

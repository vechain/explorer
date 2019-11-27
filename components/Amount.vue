<template>
    <span :class="{small: sm}">
        <span class="text-monospace">{{amount | hexToVal | balance}}</span>
        <small v-if="sym" class="text-secondary text-uppercase">{{sym}}</small>
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

    @Prop({default:false})
    sm!: boolean
}
</script>

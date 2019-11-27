<template>
    <div v-if="transfer">
        <small class="mr-3">From</small>
        <AccountLink :address="transfer.sender" size="sm" />
        <small class="mx-3">To</small>
        <AccountLink :address="transfer.recipient" size="sm" />
        <small>
            <span class="mx-3">For</span>
            <span class="text-monospace">
                <strong>{{transfer.amount | hexToVal | balance}}</strong>
                <strong>{{transfer.symbol}}</strong>
            </span>
        </small>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import IdentBox from '@/components/IdentBox.vue'
import AccountLink from '@/components/AccountLink.vue'
@Component({
    components: {
        IdentBox,
        AccountLink
    }
})
export default class TokenTransferItem extends Vue {
    @Prop()
    transfer!: {
        sender: string
        recipient: string
        amount: string
        symbol: string
    }
}
</script>

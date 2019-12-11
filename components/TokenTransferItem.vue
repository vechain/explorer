<template>
    <div  class="d-inline-block d-sm-flex align-items-center" v-if="transfer">
        <small class="mr-2">From</small>
        <AccountLink v-if="origin !== transfer.sender" :address="transfer.sender" size="sm" />
        <span v-else>
            <strong>Origin</strong>
        </span>
        <small class="mx-2">To</small>
        <AccountLink v-if="origin !== transfer.recipient" :address="transfer.recipient" size="sm" />
        <span v-else>
            <strong>Origin</strong>
        </span>
        <small>
            <span class="mx-2">For</span>
            <span class="text-monospace">
                <strong>
                    <Amount :amount="transfer.amount" :sym="transfer.symbol"/>
                </strong>
            </span>
        </small>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import IdentBox from '@/components/IdentBox.vue'
import AccountLink from '@/components/AccountLink.vue'
import Amount from '@/components/Amount.vue'
@Component({
    components: {
        IdentBox,
        AccountLink,
        Amount
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

    @Prop(String)
    origin!: string
}
</script>

<template>
    <div v-if="transfer">
        <small class="mr-3">From</small>
        <IdentBox
            class="d-inline-block mr-1 rounded align-middle"
            style="width: 30px; height: 17px"
            :address="transfer.sender"
        ></IdentBox>
        <nuxt-link
            :to="{name: 'account-id', params: {
                          id: transfer.sender
                        }}"
        >
            <small>{{transfer.sender | toChecksumAddress | shortAddress}}</small>
        </nuxt-link>
        <small class="mx-3">To</small>
        <IdentBox
            class="d-inline-block mr-1 rounded align-middle"
            style="width: 30px; height: 17px"
            :address="transfer.recipient"
        ></IdentBox>
        <nuxt-link
            :to="{name: 'account-id', params: {
                          id: transfer.recipient
                        }}"
        >
            <small>{{transfer.recipient | toChecksumAddress | shortAddress}}</small>
        </nuxt-link>
        <small>
            <span class="mx-3">For</span>
            <span class="text-monospace">
                <strong>{{transfer.amount}}</strong>
                <strong>{{transfer.symbol}}</strong>
            </span>
        </small>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import IdentBox from '@/components/IdentBox.vue'
@Component({
    components: {
        IdentBox
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

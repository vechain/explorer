<template>
    <b-row v-if="transfer">
        <b-col lg="8">
            <b-row>
                <b-col cols="5">
                    <AccountLink :address="transfer.sender" size="sm" />
                </b-col>
                <b-col cols="2">
                    <font-awesome-icon small icon="arrow-right" />
                </b-col>
                <b-col cols="5">
                    <AccountLink :address="transfer.recipient" size="sm" />
                </b-col>
            </b-row>
        </b-col>
        <b-col lg="4" class="text-right">
            <small class="text-monospace">{{transfer.amount | hexToVal | balance}}</small>
        </b-col>
    </b-row>
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
export default class TransferItem extends Vue {
    @Prop()
    transfer!: {
        sender: string,
        recipient: string,
        amount: string
    }
}
</script>

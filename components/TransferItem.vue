<template>
    <b-row v-if="transfer">
        <b-col lg="8">
            <b-row>
                <b-col cols="5">
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
                </b-col>
                <b-col cols="2">
                    <font-awesome-icon small icon="arrow-right" />
                </b-col>
                <b-col cols="5">
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
@Component({
    components: {
        IdentBox
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

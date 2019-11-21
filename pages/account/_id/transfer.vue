<template>
    <div>
        <b-table :fields="fields"></b-table>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({

})
export default class AccountTransfer extends Vue {
    fields = [
        {
            key: 'txID',
            label: 'TXID',
        }, {
            key: 'time',
            label: 'Time/Block#'
        }, {
            key: 'from-to',
            label: 'From/To'
        }, {
            key: 'token',
            label: 'Token'
        }, {
            key: 'value',
            label: 'Value'
        }
    ]
}
</script>

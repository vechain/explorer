<template>
    <b-list-group flush>
        <b-list-group-item class="border-top-0">
            <b-container fluid>
                <b-row no-gutters>
                    <b-col cols="3">
                        <div class="text-left font-weight-bold">Address</div>
                    </b-col>
                    <b-col cols="9">
                        <div class="text-break">
                            <span
                                class="text-monospace font-weight-lighter"
                            >{{account.address | toChecksumAddress}}</span>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </b-list-group-item>
    </b-list-group>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
@Component({
    middleware: 'summary',
    async asyncData(ctx: Context) {
        return {
            account: {
                ...ctx.payload,
                address: ctx.params.id
            }
        }
    }
})
export default class Summary extends Vue {
}
</script>

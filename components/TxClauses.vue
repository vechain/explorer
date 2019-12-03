<template>
    <div class="mt-4">
        <b-table show-empty empty-text="no data" hover :fields="fields" :items="clauses">
            <template v-slot:cell(index)="row"># {{row.index + 1}}</template>
            <template v-slot:cell(type)="row">
                <b-badge variant="primary">{{row.item.type}}</b-badge>
            </template>
            <template v-slot:cell(to)="row">
                <AccountLink :address="row.item.to" />
            </template>
            <template v-slot:cell(value)="row">
                <template>
                    <Amount :amount="row.item.value" sym="VET"/>
                </template>
            </template>
            <template v-slot:cell(action)="row">
                <b-button @click="row.toggleDetails" variant="outline-secondary" size="sm">
                    <font-awesome-icon small :icon="row.detailsShowing ?'angle-down' : 'angle-up'" />
                </b-button>
            </template>
            <template v-slot:row-details="row">
                <ClauseDetail
                    :inputData="row.item.data"
                    :transfers="row.item.transfers"
                    :events="row.item.events"
                />
            </template>
        </b-table>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
import ClauseDetail from '@/components/ClauseDetail.vue'
import IdentBox from '@/components/IdentBox.vue'
import AccountLink from '@/components/AccountLink.vue'
import Amount from '@/components/Amount.vue'

@Component({
    components: {
        ClauseDetail,
        IdentBox,
        AccountLink,
        Amount
    }
})
export default class TxClause extends Vue {
    @Prop()
    clauseList!: any[]

    get tokensAddress(): string[] {
        return this.$store.getters.tokenAddressList
    }

    getToken(address: string) {
        const item = this.$store.state.tokens.find((item: any) => {
            return item.address === address
        })
        return item
    }

    get clauses() {
        if (this.clauseList && this.clauseList.length) {
            return this.clauseList.map((item) => {
                let temp
                if (item.to) {
                    if (this.tokensAddress.includes(item.to)) {
                        let token = this.getToken(item.to)
                        temp = {
                            ...token,
                            type: 'Token'
                        }
                    } else if (item.data === '0x') {
                        temp = {
                            type: 'Transfer'
                        }
                    } else {
                        temp = {
                            type: 'Call'
                        }
                    }
                } else {
                    temp = {
                        type: 'Create'
                    }
                }

                return {
                    ...item,
                    ...temp
                }
            })
        }
    }

    fields = [
        {
            key: 'index',
            lable: 'Index'
        },
        {
            key: 'type',
            lable: 'Type'
        },
        {
            key: 'to',
            lable: 'To'
        },
        {
            key: 'value',
            lable: 'Value'
        },
        {
            key: 'action',
            lable: ' '
        }
    ]
}
</script>

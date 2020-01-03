<template>
    <div>
        <div class="d-flex justify-content-between align-items-center px-2">
            <div class="d-flex align-middle">
                <div>
                    {{pageItems}}
                    <span class="text-secondary">entries</span>
                    , {{currentPage}}
                    <span class="text-secondary">of</span>
                    {{pageCount | numFmt}}
                    <span class="text-secondary">pages</span>
                </div>
            </div>
            <b-pagination
                class="mt-3 d-flex"
                size="sm"
                :per-page="perPage"
                v-model="currentPage"
                :total-rows="rows"
                align="right"
            ></b-pagination>
        </div>
        <b-table
            responsive
            :current-page="currentPage"
            :per-page="perPage"
            show-empty
            empty-text="No Data"
            :fields="fields"
            :items="clauses"
        >
            <template v-slot:cell(index)="row">{{(currentPage - 1) * perPage + row.index + 1}}</template>
            <template v-slot:cell(type)="row">
                <b-badge variant="primary">{{row.item.type}}</b-badge>
            </template>
            <template v-slot:cell(to)="row">
                <AccountLink v-if="row.item.to" :address="row.item.to" />
                <span v-else>-</span>
            </template>
            <template v-slot:cell(value)="row">
                <Amount :amount="row.item.value"/>
            </template>
            <template v-slot:cell(action)="row">
                <b-button @click="row.toggleDetails" variant="outline-secondary" size="sm">
                    <font-awesome-icon small :icon="row.detailsShowing ?'angle-up' : 'angle-down'" />
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
    @Prop({ default: [] })
    clauseList!: any[]
    currentPage = 1
    perPage = 10

    get tokensAddress(): string[] {
        return this.$store.getters.tokenAddressList
    }

    get rows() {
        return this.clauses!.length
    }

    get pageItems() {
        if (this.rows > 0) {
            return this.currentPage === this.pageCount ? (this.rows % this.perPage) || this.perPage : this.perPage
        } else {
            return 0
        }
    }

    get pageCount() {
        return Math.floor(this.rows / this.perPage) + (this.rows % this.perPage > 0 ? 1 : 0) || 1
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
        } else {
            return []
        }
    }

    fields = [
        {
            key: 'index',
            label: 'Index'
        },
        {
            key: 'type',
            label: 'Type'
        },
        {
            key: 'to',
            label: 'To'
        },
        {
            key: 'value',
            label: 'VET Value'
        },
        {
            key: 'action',
            label: ''
        }
    ]
}
</script>

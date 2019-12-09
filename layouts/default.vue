<template>
    <div>
        <Navbar @search="onsubmit"/>
        <b-container class="px-0">
            <nuxt class="pb-4 px-2 px-sm-0" />
        </b-container>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Navbar from '../components/Navbar.vue'
@Component({
    components: {
        Navbar
    }
})
export default class DefaultLayout extends Vue {
    async onsubmit(str: string) {
        const search = str.trim()
        let rt: any = { name: 'index' }
        if (/^0x[0-9a-f]{40}$/i.test(search)) {
            rt = { name: 'account-id', params: { id: search } }
        } else if (/^[0-9]+$/.test(search)) {
            const bd = await this.$axios.$get('/api/blocks/' + search)
            rt = { name: 'block-id', params: { id: bd.block.id } }
        } else if (/^0x[0-9-a-f]{64}$/i.test(search)) {
            const bd = await this.$axios.$get('/api/blocks/' + search)
            if (bd && bd.block) {
                rt = { name: 'block-id', params: { id: bd.block.id } }
            } else {
                const txDetail = await this.$axios.$get('/api/transactions/' + search)
                if (txDetail) {
                    rt = { name: 'transaction-id', params: { id: txDetail.tx.txID } }
                }
            }
        } else { }
        this.$router.push(rt)
    }
}
</script>
<style>
body {
    background-color: #f4f7fc;
}
</style>

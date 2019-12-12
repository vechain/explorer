<template>
    <nuxt-link
        class="text-monospace"
        :to="{
            name: 'transactions-id',
            params: {
              id: id
            },
            hash: '#info'
          }"
    >
        <span v-if="short">{{id | shortID}}</span>
        <span v-else>{{id}}</span>
    </nuxt-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class TxLink extends Vue {
    @Prop()
    id!: string

    @Prop({ default: true })
    short!: boolean
}
</script>

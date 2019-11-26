<template>
    <b-card>
        <ul>
            <li v-for="(item, index )in list" :key="index">{{item}}</li>
        </ul>
    </b-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class Transfers extends Vue {
    @Prop({ default: [] })
    list!: any[]
}
</script>

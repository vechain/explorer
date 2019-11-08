<template>
        <h2>
            Example heading
            <b-badge>New</b-badge>
        </h2>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Context } from '@nuxt/types'
@Component({
    layout(ctx: Context) {
        return 'default'
    }
})
export default class App extends Vue {}
</script>

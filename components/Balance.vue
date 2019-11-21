<template>
    <blockquote class="blockquote mb-0 balance">
        <p class="mb-0 text-monospace">
            <small>{{balance | hexToVal | balance}}</small>
        </p>
        <footer class="blockquote-footer text-monospace">
            <small>1.2222BTC</small>
        </footer>
    </blockquote>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class Balance extends Vue {
    @Prop(String)
    balance!: string

    @Prop(String)
    token!: string
}
</script>
<style scoped>
.balance {
    line-height: 1.1;
}
.balance .blockquote-footer::before {
    content: "\2248";
}
</style>

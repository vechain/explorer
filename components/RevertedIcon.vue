<template>
    <span v-b-tooltip.hover title="Reverted">
        <font-awesome-icon
            style="color: red"
            icon="exclamation-circle"
        />
    </span>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class RevertedIcon extends Vue {}
</script>
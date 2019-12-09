<template>
    <div :style="styleObj">
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { picasso } from '@vechain/picasso'
@Component
export default class IdentBox extends Vue {
    @Prop(String)
    address!: string

    get styleObj() {
        if (this.address) {
            return {
            'background-image': `url('data:image/svg+xml;utf8,${picasso(this.address.toLowerCase())}')`,
            'background-size': 'cover',
            'background-repeat': 'no-repeat'
            }
        }
    }
}
</script>

<template>
    <div class="d-inline-block align-items-center" :class="{ 'd-sm-flex' : icon}">
        <IdentBox
            v-if="icon"
            class="d-inline-block mr-1 rounded"
            :style="style"
            :address="address"
        ></IdentBox>
        <nuxt-link
            class="text-monospace"
            :to="{
              name: 'accounts-id',
              params: {
                id: address.toLowerCase()
              }}"
        >
            <template v-if="!!short">
                <small v-b-tooltip.hover.right :title="address | toChecksumAddress" v-if="this.size === 'sm'">{{address | toChecksumAddress | shortAddress}}</small>
                <span v-b-tooltip.hover.right :title="address | toChecksumAddress" v-else>{{address | toChecksumAddress | shortAddress}}</span>
            </template>
            <template v-else>
                <small v-if="this.size === 'sm'">{{address | toChecksumAddress}}</small>
                <span v-else>{{address | toChecksumAddress}}</span>
            </template>
        </nuxt-link>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import IdentBox from '@/components/IdentBox.vue'
@Component({
    components: {
        IdentBox
    }
})
export default class AccountLink extends Vue {
    @Prop()
    size!: 'sm' | 'normal' | null

    @Prop({default: true})
    short!: boolean

    @Prop(String)
    address!: string

    @Prop({default: true})
    icon!: boolean

    sizes = {
        sm: 'width: 30px; height: 20px',
        normal: 'width: 55px; height: 30px'
    }

    get style() {
        return this.sizes['sm']
    }

}
</script>

<template>
    <NotFoundContent v-if="statusCode === 404" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import NotFoundContent from '../components/NotFoundContent.vue'
import { Context } from '@nuxt/types'
@Component({
    components: {
        NotFoundContent,
    },
})
export default class ErrorPage extends Vue {
    @Prop({ default: null })
    error: any
    get statusCode(): number {
        return (this.error && this.error.statusCode) || 500
    }
}
</script>

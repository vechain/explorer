<template>
    <div v-if="statusCode===404">
        <div class="my-3">
            <h3 class="d-inline-block">Page not found</h3>
        </div>
        <div class="text-break">
            <p class="my-4">Sorry we cannot locate the page you requested, please go back to the explorer homepage by clicking the button below.</p>
            <b-button squared variant="outline-primary" :to="{name: 'index'}">BACK TO HOMEPAGE</b-button>
        </div>
    </div>
    <div v-else>
        <div class="my-3">
            <h3 class="d-inline-block">
                <span>Error</span>
                <span class="text-danger">{{statusCode}}</span>
            </h3>
        </div>
        <div class="text-break">
            <p class="my-4">
                This page is not working, please check the error below or contact
                <a
                    href="mailto:support@vechain.org"
                >support@vechain.org</a> if the issue still occurs.
            </p>

            <b-button squared variant="outline-primary" :to="{name: 'index'}">BACK TO HOMEPAGE</b-button>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class ErrorPage extends Vue {
    @Prop({ default: null })
    error: any
    get statusCode(): number {
        return (this.error && this.error.statusCode) || 500
    }
}
</script>

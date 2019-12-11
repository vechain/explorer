<template>
    <div>
        <div class="my-3">
            <h3 class="d-inline-block">
                <span>Error</span>
                <span class="text-danger">{{code}}</span>
            </h3>
        </div>
        <div class="text-break">
            <p class="my-4">
                This page is not working, please check the error below or contact
                <a
                    href="mailto:support@vechain.com"
                >support@vechain.com</a> if the issue still occurs.
            </p>

            <p class="text-secondary">Message: {{msg}}</p>
            <b-button squared variant="outline-primary" :to="{name: 'index'}">BACK TO HOMEPAGE</b-button>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import {Context} from '@nuxt/types'
@Component({
    async asyncData(ctx: Context) {
        return {
            code: ctx.query.code,
            msg: ctx.query.msg
        }
    }
})
export default class ErrorPage extends Vue {
}
</script>

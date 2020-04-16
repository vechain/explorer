<template>
    <div class="d-flex align-items-center flex-column">
        <h5 class="text-center my-5">Export Transfer History</h5>
        <b-card class="border-0 shadow-sm">
            <div>
                <b-form
                    target="_blank"
                    action="/api/export/transfers/0x15bccf377f1a9bbd0cd8e24d031c9451326f29a0"
                    method="post"
                    class="my-a"
                >
                    <b-form-group label="Address" label-class="text-dark">
                        <AccountLink :short="false" :address="$route.query.address" />
                    </b-form-group>
                    <b-form-group label="Time Period">
                        <div class="d-flex flex-row align-content-center mb-3">
                            <div class="align-self-center mr-2">From</div>
                            <div>
                                <b-form-datepicker v-model="from"></b-form-datepicker>
                            </div>
                            <div class="align-self-center mx-2">To</div>
                            <div>
                                <b-form-datepicker v-model="to"></b-form-datepicker>
                            </div>
                        </div>
                    </b-form-group>
                    <vue-hcaptcha
                        @verify="onVerify"
                        @expired="onExpired"
                        @error="onError"
                        class="d-flex mb-4 justify-content-center"
                        sitekey="0ce95d72-89f4-4579-bee2-e27d65023ba8"
                    ></vue-hcaptcha>
                    <input type="text" class="d-none" name="from" v-model="from" />
                    <input type="text" class="d-none" name="to" v-model="to" />
                    <b-button
                        :disabled="disabled"
                        type="submit"
                        size="sm"
                        squared
                        class="px-5 d-block m-auto"
                        variant="primary"
                    >Export</b-button>
                </b-form>
            </div>
            <p class="mt-3 text-muted">
                <small>Tip: earliest 50k of records will be export, if the file over x|x records, please adjust the start date</small>
            </p>
        </b-card>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AccountLink from '@/components/AccountLink.vue'
@Component({
    components: {
        AccountLink
    }
})
export default class Download extends Vue {
    from: string = ''
    to: string = ''
    disabled = true

    onVerify(token: string) {
        this.disabled = false
    }

    onExpired(r: any) {
        console.log(r)
    }

    onError(r: any) {
        console.log(r)
    }

    mounted() {
        const date = new Date()
        this.to = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        date.setFullYear(date.getFullYear() - 1)
        this.from = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
}
</script>
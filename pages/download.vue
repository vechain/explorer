<template>
    <div class="d-flex align-items-center flex-column">
        <h5 class="text-center my-5">Export Transfer History</h5>
        <b-card class="border-0 shadow-sm mw-100 overflow-hidden">
            <div>
                <b-form
                    target="_blank"
                    :action="'/api/export/transfers/' + $route.query.address"
                    method="post"
                    @submit="onsubmit"
                    class="my-a px-2 px-md-0"
                >
                    <b-form-group label="Address" label-class="text-dark font-weight-bolder">
                        <AccountLink class="text-break" :short="false" :address="$route.query.address" />
                    </b-form-group>
                    <b-form-group label="Time Period" label-class="text-dark font-weight-bolder">
                        <div class="d-flex flex-md-row flex-column align-content-center mb-3">
                            <div class="align-self-start align-self-md-center mb-2 mb-md-0 mr-2 text-left">From</div>
                            <div>
                                <b-form-datepicker v-model="from"></b-form-datepicker>
                            </div>
                            <div class="align-self-start align-self-md-center my-2 my-md-0 mr-2 mx-md-2 text-left">To</div>
                            <div>
                                <b-form-datepicker v-model="to"></b-form-datepicker>
                            </div>
                        </div>
                    </b-form-group>
                    <vue-hcaptcha
                        @verify="onVerify"
                        @expired="onExpired"
                        @error="onError"
                        ref="hcaptcha"
                        class="d-flex mb-4 justify-content-center"
                        sitekey="0ce95d72-89f4-4579-bee2-e27d65023ba8"
                    ></vue-hcaptcha>
                    <input type="text" class="d-none" name="from" v-model="from" />
                    <input type="text" class="d-none" name="to" v-model="to" />
                    <input type="text" class="d-none" name="token" v-model="token" />

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
                <small>Tip: earliest 50k of records will be export, if you need more records, please adjust the time period</small>
            </p>
        </b-card>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import VueHcaptcha from '@hcaptcha/vue-hcaptcha/src/component/vue-hcaptcha.vue'
import AccountLink from '@/components/AccountLink.vue'
@Component({
    components: {
        AccountLink
    }
})
export default class Download extends Vue {
    from: string = ''
    to: string = ''
    token: string = ''
    disabled = true

    onVerify(token: string) {
        this.token = token
        this.disabled = false
    }
    onsubmit() {
        (this.$refs['hcaptcha'] as any).reset()
        this.disabled = true
    }
    onExpired(r: any) {
        (this.$refs['hcaptcha'] as any).reset()
        this.disabled = true
    }

    onError(r: any) {
        console.log(r)
    }

    mounted() {
        const date = new Date()
        this.to = date.toISOString().split('T')[0]
        date.setMonth(date.getMonth() - 1)
        this.from = date.toISOString().split('T')[0]
    }
}
</script>
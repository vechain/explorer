<template>
    <div>
        <div v-show="!formatedStatus" class="mt-3" style="text-align: center;">
            <b-spinner type="grow" middle />
        </div>
        <div class="d-none d-sm-block" v-if="!!formatedStatus">
            <b-row no-gutters>
                <b-col cols="4" class="border-right border-bottom py-2">
                    <div class="text-truncate text-muted small">Best Block</div>
                    <div class="text-monospace">{{  formatedStatus.best  }}</div>
                </b-col>
                <b-col cols="8" class="py-2 pl-2 border-bottom">
                    <div class="text-truncate text-muted small">Check Point</div>
                    <div class="text-monospace">{{  formatedStatus.processing  }}</div>
                </b-col>
            </b-row>
            <b-row no-gutters >
                <b-col cols="4" class="border-right py-2">
                    <div class="text-truncate text-muted small">Finalized Block</div>
                    <div class="text-monospace">{{  formatedStatus.finalized  }}</div>
                </b-col>
                <b-col cols="5" class="py-2 pl-2">
                    <div class="text-truncate text-muted small">Scheduled Check point</div>
                    <div class="text-monospace">{{  formatedStatus.voting  }}</div>
                </b-col>
                <b-col cols="2" offset="1" class="py-2 my-sm-0">
                    <div class="text-truncate text-muted small">Epoch</div>
                    <div class="text-monospace">{{  formatedStatus.epoch  }}</div>
                </b-col>
            </b-row>
        </div>
        <div class="d-sm-none d-block mb-2" v-if="!!formatedStatus">
            <b-row no-gutters>
                <b-col cols="6" md="4" class="border-right border-bottom px-1 py-2">
                    <div class="text-truncate text-muted small">Best Block</div>
                    <div class="text-monospace">{{  formatedStatus.best  }}</div>
                </b-col>
                <b-col cols="6" md="4" class="border-bottom pl-2 py-2">
                    <div class="text-truncate text-muted small">Finalized Block</div>
                    <div class="text-monospace">{{  formatedStatus.finalized  }}</div>
                </b-col>
            </b-row>
            <b-row no-gutters>
                <b-col class="px-1 py-2 border-bottom">
                    <div class="text-truncate text-muted small">Check Point</div>
                    <div class="text-monospace">{{  formatedStatus.processing  }}</div>
                </b-col>
            </b-row>
            <b-row no-gutters>
                <b-col cols="6" md="5" class="py-2 px-1 border-right border-bottom">
                    <div class="text-truncate text-muted small">Scheduled Check point</div>
                    <div class="text-monospace">{{  formatedStatus.voting  }}</div>
                </b-col>
                <b-col class="py-2 pl-2 my-sm-0 border-bottom" cols="6" offset-md="1" md="2">
                    <div class="text-truncate text-muted small">Epoch</div>
                    <div class="text-monospace">{{  formatedStatus.epoch  }}</div>
                </b-col>
            </b-row>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Status extends Vue {
    @Prop(Object)
    infos!: DTO.Status

    get formatedStatus() {
        if (this.infos) {
            const { best, finalized, processing, voting } = this.infos
            const bestNum = Vue.filter('bNum')(best)
            const finalizedNum = Vue.filter('bNum')(finalized)
            return {
                best: bestNum.toLocaleString(),
                finalized: finalizedNum.toLocaleString(),
                processing: voting > bestNum ? 'N/A' : processing,
                voting: voting.toLocaleString(),
                epoch: voting > bestNum ? 'N/A' : (bestNum % 180 + '/180')
            }
        }
    }
}

</script>
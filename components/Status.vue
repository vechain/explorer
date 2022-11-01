<template>
    <div>
        <div v-show="!formatedStatus" class="mt-3" style="text-align: center;">
            <b-spinner type="grow" middle />
        </div>
        <div class="d-none d-sm-block" v-if="!!formatedStatus">
            <b-row no-gutters>
                <b-col cols="4" class="border-right border-bottom py-2">
                    <div class="text-truncate text-muted small">Best Block</div>
                    <div>
                        <router-link class="text-monospace" :to="{name:'blocks-id', params: {id: formatedStatus.best}}">
                            {{formatedStatus.best | bNum | numFmt}}
                        </router-link>
                    </div>
                </b-col>
                <b-col cols="8" class="py-2 pl-2 border-bottom">
                    <div class="text-truncate text-muted small">Checkpoint</div>
                    <div class="text-monospace" :style="{fontSize: formatedStatus.size + 'px'}">{{  formatedStatus.processing  }}</div>
                </b-col>
            </b-row>
            <b-row no-gutters >
                <b-col cols="4" class="border-right py-2">
                    <div class="text-truncate text-muted small">Finalized Block</div>
                    <div>
                        <router-link class="text-monospace" :to="{name:'blocks-id', params: {id: formatedStatus.finalized}}">
                            {{formatedStatus.finalized | bNum | numFmt}}
                        </router-link>
                    </div>
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
                    <div>
                        <router-link class="text-monospace" :to="{name:'blocks-id', params: {id: formatedStatus.best}}">
                            {{formatedStatus.best | bNum | numFmt}}
                        </router-link>
                    </div>
                </b-col>
                <b-col cols="6" md="4" class="border-bottom pl-2 py-2">
                    <div class="text-truncate text-muted small">Finalized Block</div>
                    <div>
                        <router-link class="text-monospace" :to="{name:'blocks-id', params: {id: formatedStatus.finalized}}">
                            {{formatedStatus.finalized | bNum | numFmt}}
                        </router-link>
                    </div>
                </b-col>
            </b-row>
            <b-row no-gutters>
                <b-col class="px-1 py-2 border-bottom">
                    <div class="text-truncate text-muted small">Check Point</div>
                    <div class="text-monospace" :style="{fontSize: formatedStatus.size + 'px'}">{{  formatedStatus.processing  }}</div>
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
            const processingLen = processing.length
            return {
                best,
                finalized,
                processing: voting > bestNum ? 'N/A' : (() => {
                    if (processing.length === 0) {
                        return 'N/A'
                    } else if (processing.length < 4) {
                        return  processing.map(i => i.toLocaleString()).join(' / ')
                    } else {
                        return [...processing.slice(0, 2), '...', processing.at(-1)].join(' / ')
                    }
                })(),
                voting: voting.toLocaleString(),
                epoch: voting > bestNum ? 'N/A' : (bestNum % 180 + '/180'),
                size: (() => {
                    if (processingLen === 3) {
                        return 14
                    } else if (processingLen > 3) {
                        return 12
                    }
                })()
            }
        } else {
            return null
        }
    }
}

</script>
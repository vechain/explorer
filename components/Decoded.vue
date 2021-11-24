<template>
    <div>
        <b-button-group size="sm">
            <b-button
                size="sm"
                :variant="current!=='raw' ? 'outline-secondary' : ''"
                @click="current = 'raw'"
            >Raw</b-button>
            <b-button
                size="sm"
                :variant="current!=='decoded' ? 'outline-secondary' : ''"
                @click="current = 'decoded'"
            >
            <b-spinner v-if="loadingAbi" small type="grow"></b-spinner>
            {{loadingAbi ? 'Decoding' : 'Decoded'}}</b-button>
            <b-button
                size="sm"
                :variant="current!=='utf8' ? 'outline-secondary' : ''"
                @click="current = 'utf8'"
            >UTF-8</b-button>
        </b-button-group>
        <div v-show="current==='raw'">
            <b-form-textarea readonly class="mt-3" v-if="isData" :value="inputData" size="sm"></b-form-textarea>
            <b-list-group v-else flush>
                <b-list-group-item class="px-0">
                    <b-container fluid>
                        <b-row no-gutters>
                            <b-col cols="12" sm="2" class="align-self-center">
                                <span class="text-left font-weight-bold align-middle">Topics</span>
                            </b-col>
                            <b-col cols="12" sm="9">
                                <ul class="pl-0">
                                    <li class="text-break" v-for="(item, i) in event.topics" :key="i">
                                        <small class="text-monospace">[{{i}}] {{item}}</small>
                                    </li>
                                </ul>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-list-group-item>
                <b-list-group-item class="px-0">
                    <b-container fluid>
                        <b-row no-gutters>
                            <b-col cols="12" sm="2" class="align-self-center">
                                <span class="text-left font-weight-bold align-middle">Data</span>
                            </b-col>
                            <b-col cols="12" sm="9" class="text-break">
                                <small class="text-monospace">{{event.data}}</small>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-list-group-item>
            </b-list-group>
        </div>
        <div v-show="current ==='decoded'">
            <div v-if="decoded" class="mt-3">
                <b-card-header class="py-1">
                    <strong
                        class="text-monospace"
                    >{{abiJson && abiJson.type}} {{decoded.canonicalName}}</strong>
                </b-card-header>
                <div class="px-3 py-2 overflow-auto">
                    <table class="table mb-0">
                        <template v-if="decoded.params.length>0">
                            <tr class="table-borderless">
                                <th class="p-1">#</th>
                                <th class="p-1">Name</th>
                                <th class="p-1">Type</th>
                                <th class="p-1">Data</th>
                            </tr>
                            <tr
                                class="text-monospace"
                                v-for="(param, i) in decoded.params"
                                :key="i"
                            >
                                <td class="p-1">
                                    <small>{{i}}</small>
                                </td>
                                <td class="p-1">
                                    <small>{{param.name}}</small>
                                </td>
                                <td class="p-1">
                                    <small>
                                        {{param.type}}
                                        <sup v-if="param.indexed">indexed</sup>
                                    </small>
                                </td>
                                <td class="p-1">
                                    <AccountLink
                                        v-if="param.type==='address'"
                                        :address="param.value"
                                        :short="false"
                                        size="sm"
                                    />
                                    <template v-else>
                                        <small>{{param.value}}</small>
                                    </template>
                                </td>
                            </tr>
                        </template>
                        <tr v-else class="table-borderless">
                            <td align="center">No Parameter</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div v-else-if="loadingAbi" class=" py-3 text-center">
                <b-spinner type="grow" />
            </div>
            <div class="mt-2 text-center small" v-else>Unable to decode data</div>
        </div>
        <div v-show="current==='utf8'">
            <b-form-textarea readonly class="mt-3" v-if="isData" :value="utf8Str" size="sm"></b-form-textarea>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import ListItem from '@/components/ListItem.vue'
import AccountLink from '@/components/AccountLink.vue'
import { abi } from 'thor-devkit/dist/abi'
@Component({
    components: {
        ListItem,
        AccountLink
    }
})
export default class Decoded extends Vue {
    @Prop(Object)
    event!: DTO.Event

    @Prop(String)
    inputData!: string

    loadingAbi = false

    abiJson: abi.Function.Definition | abi.Event.Definition | null = null
    current = 'raw'

    decoded?: {
        params: any[],
        canonicalName: string
    } | null = null

    utf8Str?: string = ''

    get isData() {
        return !!this.inputData
    }

    async getAbi(key: string) {
        let result = this.$store.state.abis[key]
        if (result) {
            return result
        } else {
            result = await this.queryAbi(key)
            return result
        }
    }

    getDecodedFunction() {
        if (this.abiJson) {
            const json = this.abiJson as abi.Function.Definition
            const fn = new abi.Function(json)
            const dec = abi.decodeParameters(json.inputs, '0x' + this.inputData!.slice(10))
            return {
                params: json.inputs.map((p, i) => {
                    return {
                        name: p.name,
                        type: p.type,
                        value: dec[i]
                    }
                }),
                canonicalName: fn.canonicalName
            }
        }
    }

    getDecodedEvent() {
        if (this.abiJson) {
            const json = this.abiJson as abi.Event.Definition
            const ev = new abi.Event(json)
            const dec = ev.decode(this.event.data, this.event.topics!)
            return {
                params: json.inputs.map((p, i) => {
                    return {
                        name: p.name,
                        type: p.type,
                        value: dec[i],
                        indexed: p.indexed
                    }
                }),
                canonicalName: ev.canonicalName
            }
        }
    }

    utf8Decode() {
        if (!this.inputData || this.inputData.length % 2 !== 0) {
            return ''
        }
        const str = this.inputData.startsWith('0x') ? this.inputData.substring(2) : this.inputData
        let temp = []
        let result: Uint8Array
        const decoder = new TextDecoder()
        for (let i = 0; i < str.length; i+=2) {
            temp.push(parseInt(str.substr(i, 2), 16))
        }

        result = Uint8Array.from(temp)

        return decoder.decode(result).toString()
    }

    async queryAbi(key: string) {
        this.loadingAbi = true
        const abi = await this.$store.dispatch('queryAbi', key)
        this.loadingAbi = false
        return abi
    }

    mounted() {
        this.utf8Str = this.utf8Decode()
    }

    async created() {
        let key = this.inputData ? this.inputData.slice(0, 10).toLowerCase() : (this.event && this.event.topics!.length) ? this.event.topics![0] : ''

        if (key) {
            this.abiJson = await this.getAbi(key)
        }
        if (this.isData) {
            this.decoded = this.getDecodedFunction()
        } else {
            this.decoded = this.getDecodedEvent()
        }
    }
}
</script>

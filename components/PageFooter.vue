<template>
    <div class="page-footer mt-auto pt-4 pb-2 text-white">
        <b-row no-gutters align-h="around">
            <b-col cols="6" sm="3" md="2" v-for="item in links" :key="item.group" class="pl-5">
                <ul class="pl-0">
                    <li>
                        <span class="text-white">{{item.group}}</span>
                    </li>
                    <template v-for="(item) in item.list">
                        <li class="small" :key="item.name">
                            <a
                                class="text-white font-weight-lighter"
                                :href="item.link"
                                target="_blank"
                            >{{item.name}}</a>
                        </li>
                    </template>
                </ul>
            </b-col>
        </b-row>
        <b-row no-gutters class="pt-2 justify-content-center">
            <b-col sm="8" class="text-center">
                <small class="text-white">
                    Copyright &copy; 2019
                    <a
                        class="text-white"
                        href=" https://vechain.org"
                        target="_blank"
                    >VeChain Foundation</a>
                </small>
            </b-col>
        </b-row>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class PageFooter extends Vue {
    links = [
        {
            group: 'Community Projects',
            list: [

                {
                    name: 'VeChainStats',
                    link: 'https://vechainstats.com'
                },
                {
                    name: 'Vexplorer (beta)',
                    link: 'https://vexplorer.io'
                },
                {
                    name: 'VechainThorScan (beta)',
                    link: 'https://vechainthorscan.com'
                }
            ]
        },
        {
            group: 'Resources',
            list: [
                {
                    name: 'Token Registry',
                    link: 'https://github.com/vechain/token-registry'
                },
                {
                    name: 'B32',
                    link: 'https://b32.vecha.in'
                },
                {
                    name: 'Inspector',
                    link: 'https://inspector.vecha.in/'
                }
            ]
        },
        {
            group: 'Tokens',
            list: [
                {
                    name: 'Token Transfer',
                    link: 'https://laalaguer.github.io/vechain-token-transfer/'
                },
                {
                    name: 'My Tokens',
                    link: 'https://tokens.vecha.in/'
                }
            ]
        },
        {
            group: 'Github',
            list: [
                {
                    name: 'VeChain',
                    link: 'https://github.com/vechain'
                }
            ]
        }
    ]
}
</script>

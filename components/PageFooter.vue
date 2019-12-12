<template>
    <b-jumbotron class="page-footer rounded-0 mb-0">
        <b-container class="px-0">
            <b-row no-gutters class="border-bottom">
                <b-col cols="12" sm="6" class="text-left px-sm-3">
                    <span class="text-muted">Community Explorers</span>
                    <ul class="pl-0 d-flex small">
                        <template v-for="(item, i) in explors">
                            <li :key="item.link">
                                <a style="color: #5A86E6" :href="item.link" target="_blank">{{item.name}}</a>
                            </li>
                            <li
                                v-if="i !== (explors.length -1)"
                                :key="item.link"
                                class="px-2 text-muted"
                            >/</li>
                        </template>
                    </ul>
                </b-col>
                <b-col cols="12" sm="6" class="text-left px-sm-3">
                    <span class="text-muted">Tools</span>
                    <ul class="pl-0 d-flex small">
                        <template v-for="(item, i) in tools">
                            <li :key="item.link">
                                <a style="color: #5A86E6" :href="item.link" target="_blank">{{item.name}}</a>
                            </li>
                            <li
                                v-if="i !== (tools.length -1)"
                                :key="item.link"
                                class="px-2 text-muted"
                            >/</li>
                        </template>
                    </ul>
                </b-col>
            </b-row>
            <b-row no-gutters class="pt-2 justify-content-center">
                <b-col sm="8" class="text-center">
                    <small class="text-muted">
                        Copyright &copy; 2019
                        <a
                            href=" https://vechain.org"
                            target="_blank"
                        >VeChain Foundation</a>
                    </small>
                </b-col>
            </b-row>
        </b-container>
    </b-jumbotron>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class PageFooter extends Vue {
    explors = [
        
        {
            name: 'Vechain stats',
            link: 'https://vechainstats.com/'
        },
        {
            name: 'Vexplore',
            link: 'https://vexplorer.io/'
        }
    ]
    tools = [
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
        },
        {
            name: 'App-hub',
            link: 'https://apps.vechain.org/'
        }
    ]
}
</script>
<style scoped>
ul {
    list-style: none;
}
.page-footer {
    background-color: transparent;
}
</style>

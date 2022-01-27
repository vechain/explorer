<template>
    <div>
        <b-navbar toggleable="sm" type="dark" class="nav-bar-styles">
            <b-navbar-brand :to="{name: 'index'}">
                <img v-if="!jumbotron" style="height: 24px; width: 24px" src="~/assets/logo.png" />
                <span class="font-weight-lighter">VeChain</span>
                <strong>Explorer</strong>
                <small>
                    <b-badge class="net-badge text-capitalize">{{network}}</b-badge>
                </small>
            </b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="ml-auto"></b-navbar-nav>
                <b-navbar-nav v-if="!jumbotron" class="mt-3 mt-sm-0 mr-sm-1">
                    <Search :small="true"/>
                </b-navbar-nav>
                <b-navbar-nav>
                    <b-nav-item-dropdown toggle-class="text-white" text="Networks" right>
                        <b-dropdown-item
                            target="_blank"
                            v-for="item in networks"
                            :key="item.text"
                            :href="item.link"
                        >{{item.text}}</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <b-jumbotron v-if="jumbotron" class="nav-bar-styles py-4 rounded-0 mb-0">
            <b-container>
                <b-row class="justify-content-center">
                    <b-col cols="12" md="8" class="pb-2 align-middle d-flex">
                        <img style="height: 30px; width: 30px" src="~/assets/logo.png" />
                        <span
                            class="h4 mb-0 ml-1 font-weight-light text-white"
                        >What are you looking for?</span>
                    </b-col>
                    <b-col cols="12" md="8">
                        <Search />
                    </b-col>
                </b-row>
            </b-container>
        </b-jumbotron>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Search from './Search.vue'
@Component({
    components: {
        Search
    }
})
export default class Navbar extends Vue {
    @Prop({ default: false })
    jumbotron!: boolean
    isVisible = false
    network = process.env.current
    networks = process.env.networks
}
</script>
<style>
.small-list {
    position: absolute;
    width: 100%;
    top: 110%;
    z-index: 1000;
}
</style>

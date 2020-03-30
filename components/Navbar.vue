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
                    <b-nav-form action="/" @submit.prevent="onsearch">
                        <b-input-group>
                            <b-form-input
                                type="search"
                                size="sm"
                                ref="input-search"
                                v-model.trim="search"
                                placeholder="Account/TxID/Block#"
                            ></b-form-input>
                            <b-input-group-append>
                                <b-button
                                    size="sm"
                                    class="border-0 shadow-none"
                                    style="background-color: #5A86E6"
                                    type="submit"
                                >Search</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-nav-form>
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
                        <b-form action="/" @submit.prevent="onsearch">
                            <b-input-group>
                                <b-form-input
                                    type="search"
                                    ref="input-search"
                                    v-model.trim="search"
                                    placeholder="Account/TxID/Block#"
                                ></b-form-input>
                                <b-input-group-append>
                                    <b-button
                                        class="border-0 shadow-none"
                                        style="background-color: #5A86E6"
                                        type="submit"
                                    >Search</b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form>
                    </b-col>
                </b-row>
            </b-container>
        </b-jumbotron>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class Navbar extends Vue {
    @Prop({ default: false })
    jumbotron!: boolean

    isVisible = false

    network = process.env.current
    search = ''
    networks = process.env.networks
    onsearch() {
        (this.$refs['input-search'] as HTMLInputElement).blur()
        if (this.search.trim()) {
            this.$router.push({
                name: 'search',
                query: {
                    content: this.search.trim()
                }
            })
        }
        this.search = ''
    }
}
</script>

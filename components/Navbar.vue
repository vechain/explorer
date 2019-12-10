<template>
    <b-navbar toggleable="sm" type="dark" style="background-color: #3C5999">
        <b-navbar-brand :to="{name: 'index'}">
            <span class="font-weight-lighter">VeChain</span>
            <strong>Explorer</strong>
            <b-badge :class="bclass" class="net-badge text-capitalize">{{network}}</b-badge>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav></b-navbar-nav>
            <b-navbar-nav class="ml-auto mt-3 mt-sm-0 mr-sm-1">
                <b-nav-form @submit.prevent="onsearch">
                    <b-input-group>
                        <b-form-input
                            size="sm"
                            v-model.trim="search"
                            placeholder="Account/TxID/Block#"
                        ></b-form-input>
                        <b-input-group-append>
                            <b-button
                                size="sm"
                                style="background-color: #5A86E6"
                                type="submit"
                            >Search</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-nav-form>
            </b-navbar-nav>
            <b-navbar-nav class="mr-sm-4">
                <b-dropdown variant="outline-secondary" toggle-class="text-white border-0" text="Network" size="sm">
                    <b-dropdown-item
                        target="_blank"
                        v-for="item in networks"
                        :key="item.text"
                        :href="item.link"
                    >{{item.text}}</b-dropdown-item>
                </b-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Navbar extends Vue {
    network = process.env.current
    search = ''
    bclass = process.env.badgeClass
    networks = process.env.networks
    onsearch() {
        this.$router.push({
            name: 'search',
            query: {
                content: this.search.trim()
            }
        })
        this.search = ''
    }
}
</script>
<style scoped>
.net-badge {
    color: #3c5999;
}
.net-badge.main {
    background-color: #fff;
}
.net-badge.test {
    background-color: #F3A71A;
}
</style>

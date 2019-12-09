<template>
    <b-navbar toggleable="sm" type="dark" style="background-color: #3C5999">
        <b-navbar-brand :to="{name: 'index'}">
            <span class="font-weight-lighter">VeChain</span>
            <strong>Explorer</strong>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav></b-navbar-nav>
            <b-navbar-nav class="ml-auto mt-3 mt-sm-0 mr-sm-5">
                <b-nav-form @submit.prevent="onsearch">
                    <b-input-group>
                        <b-form-input
                            size="sm"
                            v-model.trim="search"
                            placeholder="Account/TxID/Block#"
                        ></b-form-input>
                        <b-input-group-append>
                            <b-button size="sm" style="background-color: #5A86E6" type="submit">Search</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-nav-form>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Navbar extends Vue {
    search = ''
    onsearch() {
        this.$emit('search', this.search.trim())
        this.search = ''
    }
}
</script>

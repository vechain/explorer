<template>
    <b-navbar toggleable="sm" type="dark" style="background-color: #3C5999">
        <b-navbar-brand :to="{name: 'index'}">
            <span class="font-weight-lighter">VeChain</span>
            <strong>Explorer</strong>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto mr-5">
                <b-nav-form>
                    <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                    <b-button size="sm" class="mr-sm-2" variant="light" type="submit">Search</b-button>
                </b-nav-form>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>
<script>
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Navbar extends Vue {
}
</script>

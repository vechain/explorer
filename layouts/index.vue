<template>
    <div>
        <Navbar :jumbotron="true" />
        <b-container class="px-0">
            <nuxt class="pb-4 px-2 px-sm-0" />
        </b-container>
        <PageFooter />
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Navbar from '../components/Navbar.vue'
import PageFooter from '../components/PageFooter.vue'
@Component({
    components: {
        Navbar,
        PageFooter
    }
})
export default class DefaultLayout extends Vue { }
</script>

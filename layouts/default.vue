<template>
    <div>
        <Navbar />
        <b-container class="px-0">
        <nuxt class="pb-4 px-2 px-sm-0" />
        </b-container>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Navbar from '../components/Navbar.vue'
@Component({
    components: {
        Navbar
    }
})
export default class DefaultLayout extends Vue { }
</script>

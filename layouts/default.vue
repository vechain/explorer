<template>
    <div>
        <Navbar />
        <b-container>
        <nuxt class="pb-4" />
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

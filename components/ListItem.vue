<template>
    <b-list-group-item class="px-0">
        <b-container fluid>
            <b-row no-gutters>
                <b-col cols="12" sm="3" lg="2" class="align-self-center">
                    <span class="text-left text-truncate font-weight-bold align-middle">
                        <slot name="label" />
                    </span>
                </b-col>
                <b-col cols="12" sm="9" lg="10" class="pl-0 mt-3 mt-sm-1">
                    <div class="text-break">
                        <slot name="item-content" />
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </b-list-group-item>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class ListItem extends Vue {
}
</script>
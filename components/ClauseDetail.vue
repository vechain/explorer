<template>
  <b-card no-body>
    <b-tabs small card>
      <b-tab title="Input Data">
        <b-card :class="{'text-center': !(inputData !== '0x')}">
          <Decoded v-if="inputData !== '0x'" :inputData="inputData" />
          <small v-else>No Data</small>
        </b-card>
      </b-tab>
      <b-tab v-if="!!transfers" title="Transfers">
        <b-card :class="{'text-center': !(transfers.length > 0)}">
          <template v-if="transfers.length > 0">
            <TransferItem v-for="(item, i) in transfers" :key="i" :transfer="item" />
          </template>
          <small v-else>No transfers</small>
        </b-card>
      </b-tab>
      <b-tab v-if="!!events" title="Events">
        <template v-if="events.length > 0">
          <b-card class="mb-1" no-body v-for="(item, i) in events" :key="i">
            <b-card-header header-class="py-1 px-3">
              <span class="mr-4">{{'# ' + i}}</span>
              <span class="ml-4">
                emitter
                <AccountLink :address="item.address" size="sm" :icon="false" />
              </span>
            </b-card-header>
            <b-card-body>
              <Decoded :event="item" />
            </b-card-body>
          </b-card>
        </template>
        <b-card v-else class="text-center">
          <small v-if="!events.length">No events</small>
        </b-card>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Decoded from '@/components/Decoded.vue'
import AccountLink from '@/components/AccountLink.vue'
import TransferItem from '@/components/TransferItem.vue'
@Component({
  components: {
    Decoded,
    TransferItem,
    AccountLink
  }
})
export default class ClauseDetail extends Vue {
  @Prop({ default: null })
  inputData!: string | null

  @Prop({ default: null })
  events!: DTO.Event[] | null

  @Prop({ default: null })
  transfers!: DTO.TransferItem[] | null
}
</script>

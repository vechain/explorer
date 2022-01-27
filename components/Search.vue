<template>
  <Component
    :is="tag"
    action="/"
    @submit.prevent="onsearch"
    @keydown="onkeydown"
    @focusout="onfocusout"
    
  >
    <b-input-group ref="group">
      <b-form-input
        type="search"
        v-bind="attr"
        ref="input-search"
        autocomplete="off"
        v-model.trim="search"
        placeholder="Account/TxID/Block#/Token"
      ></b-form-input>
      <b-list-group ref="datalist" style="height: 450px; overflow: auto" v-if="tokens.length && showList" class="small-list">
        <b-list-group-item
          :href="`/accounts/${token.address}`"
          v-for="token in tokens"
          :key="token.address"
        >
          <div class="d-flex align-items-center">
            <img width="30px" :src="token.imgUrl" alt />
            <div class="ml-3">
              <blockquote class="blockquote mb-0">
                <div class="mb-0" style="font-size: 16px">
                  {{ token.symbol }}
                </div>
                <div class="text-secondary" style="font-size: 14px">
                  {{ token.name }}
                </div>
              </blockquote>
            </div>
          </div>
        </b-list-group-item>
      </b-list-group>
      <b-input-group-append>
        <b-button
          v-bind="attr"
          class="border-0 shadow-none"
          style="background-color: #5a86e6"
          type="submit"
          >Search</b-button
        >
      </b-input-group-append>
    </b-input-group>
  </Component>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"
@Component
export default class Search extends Vue {
  @Prop({ default: false })
  small!: boolean

  tag = this.small ? "b-nav-form" : "b-form"
  attr = this.small ? { size: "sm" } : ""
  search = ""

  get tokens() {
    if (this.search) {
      return this.$store.state.tokens.filter((item: DTO.Token) => {
        return (
          item.name.toLowerCase().includes(this.search) ||
          item.symbol.toLowerCase().includes(this.search)
        )
      })
    } else {
      return []
    }
  }
  showList = false
  inputSearch!: Vue
  mounted() {
    this.inputSearch = this.$refs['input-search'] as Vue
  }

  onkeydown(event: KeyboardEvent) {
    const KeyCodes = {
      ENTER: 13,
      UP: 38,
      DOWN: 40,
      ESCAPE: 27,
      TAB: 9
    }
    const input = this.inputSearch.$el as HTMLInputElement
    const { type, keyCode } = event
    if (type === "keydown" && [KeyCodes.UP, KeyCodes.DOWN, KeyCodes.TAB].includes(keyCode)) {
      event.preventDefault()
      event.stopPropagation();
      if (this.tokens.length) {
        const list = Array.from((this.$refs.datalist as HTMLAnchorElement).children)
        if (event.target === input) {
          (list[[KeyCodes.DOWN, KeyCodes.TAB].includes(keyCode) ? 0 : list.length - 1] as HTMLAnchorElement).focus()
        } else {
          const target = event.target!as HTMLAnchorElement
          if ([KeyCodes.DOWN, KeyCodes.TAB].includes(keyCode)) {
            const next = target.nextSibling as HTMLAnchorElement
            next ? next.focus() : input.focus()
          } else if (keyCode === KeyCodes.UP) {
            const pre = target.previousSibling as HTMLAnchorElement
            pre ? pre.focus() : input.focus()
          }
        }
      }
    }

    if (type === 'keydown' && KeyCodes.ESCAPE === keyCode) {
      input.blur()
      this.showList = false
    }
  }

  @Watch('search')
  onSearchChange(v: string, ov: string) {
    if (v !== ov) {
      this.showList = true
    }
  }

  onfocusout(event: FocusEvent) {
    const {relatedTarget, currentTarget} = event
    console.log(relatedTarget)
    if (!(currentTarget as HTMLElement).contains(relatedTarget as HTMLElement)) {
      this.showList = false
    }
  }

  onsearch() {
    (this.inputSearch.$el as HTMLInputElement).blur()
    if (this.search.trim()) {
      this.$router.push({
        name: "search",
        query: {
          content: this.search.trim(),
        },
      })
    }
    this.search = ""
  }
}
</script>

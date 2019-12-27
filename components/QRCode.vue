<template>
    <div :style="{width:size+'px',height:size+'px'}" v-html="html"></div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
// tslint:disable-next-line
const QRious = require('qrious')
@Component
export default class QRCode extends Vue {
    @Prop(Number) public size!: number
    @Prop(String) public content!: string
    get html() {
        let content
        content = this.content.trim()
        return generateQRHtml(content, this.size || 100)
    }
}
const qr = new QRious()
function generateQRHtml(content: string, size: number) {
    qr.value = content
    qr.size = size * 2
    const img = qr.image as HTMLElement
    img.style.width = '100%'
    img.style.height = '100%'

    return img.outerHTML
}
</script>
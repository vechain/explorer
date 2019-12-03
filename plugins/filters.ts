import { Vue } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'
import { format as timeago } from 'timeago.js'
import { toChecksumAddress } from 'thor-devkit/dist/cry/address'

Vue.filter('shortAddress', (v: string) => {
  return v.substring(0, 8) + '...' + v.substring(v.length - 4, v.length)
})

Vue.filter('balance', (val: number) => {
  return Number(val).toLocaleString(undefined, {
    style: 'decimal',
    maximumFractionDigits: 4,
    minimumFractionDigits: 2
  })
})

Vue.filter('ago', (timestamp: number) => timeago(timestamp * 1000))

Vue.filter('bNum', (val: string) => {
  return parseInt(val.substr(0, 10), 16)
})

Vue.filter('percent', (val: number) => {
  return (val * 100).toLocaleString(undefined, {
    style: 'decimal',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }) + '%'
})

Vue.filter('hexToVal', (hex: string, decimals?: number) => {
  const temp = new BigNumber(hex)

  return temp.isGreaterThan(0)
    ? temp.div(new BigNumber('1e+' + (decimals || 18))).toString()
    : 0
})

Vue.filter('countVal', (clauses: any[]) => {
  const temp = clauses.map((item) => {
    return new BigNumber(item.value || '0x0')
  }).reduce((prev, curr) => {
    return prev.plus(curr)
  })
  return '0x' + temp.toString(16)
})

Vue.filter('valToHex', (val: string, decimals?: number) => {
  const x = new BigNumber('1e+' + decimals || 18)
  const temp = new BigNumber(val)
  return '0x' + temp.multipliedBy(x).toString(16)
})

Vue.filter('toChecksumAddress', (val: string) => {
  return toChecksumAddress(val)
})

Vue.filter('datetime', (val: number) => {
  return new Date(val * 1000).toLocaleString()
})

Vue.filter('numFmt', (val: number) => {
  if (val !== null && val !== undefined) {
    return val.toLocaleString()
  }
})

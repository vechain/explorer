<template>
    <canvas ref="canvas" />
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Chart from 'chart.js'

const gasLimitSamplesKey = 'gasLimitSamples'
type GasLimitSample = {
    n: number
    ts: number
    gl: number
}
function prettyN(n: number) {
    if (n >= 1000000) {
        return `${(n / 1000000).toFixed(2)}M`
    }
    if (n >= 1000) {
        return `${(n / 1000).toFixed(2)}K`
    }
    return `${n}`
}

@Component
export default class BandwidthChart extends Vue {
    points: number[] | null = null
    chart: Chart | null = null

    get best() {
        return this.$store.state.best
    }

    @Watch('best')
    onBest() {
        this.samplePoints()
    }

    @Watch('points')
    async onPointsChanged(n: number[], o: number[]) {
        if (n && n.length && n.toString() !== (o || '').toString()) {
            const gls = await this.getGasLimits()
            this.$emit('loaded')
            this.renderChart(gls)
        }
    }

    async created() {
        this.samplePoints()
    }

    renderChart(gls: GasLimitSample[]) {
        const labels = gls.map(s => {
            const date = new Date(s.ts * 1000)
            return `${date.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit' })}`
        })
        const limits = gls.map(s => s.gl)
        const high = Math.floor(Math.max(...limits) * 1.05)
        const low = Math.floor(Math.min(...limits) * 0.95)
        const mid = (high + low) / 2

        const refLineStyle = {
            fill: false,
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 0,
            pointHitRadius: 0,
        }

        const data = {
            labels: labels.map((l, i) => !!(i % 2) ? l : ''),
            datasets: [{
                ...refLineStyle,
                label: 'Mid',
                data: gls.map(() => mid / 10),
                borderDash: [3, 3],
            }, {
                ...refLineStyle,
                label: 'High',
                data: gls.map(() => high / 10),
                borderDash: [6, 2],
            },
            {
                ...refLineStyle,
                label: 'Low',
                data: gls.map(() => low / 10),
                borderDash: [6, 2],
            }, {
                data: limits.map(s =>  s / 10),
                fill: false,
                pointRadius: 1,
                borderColor: '#007bff',
                pointHitRadius: 8,
                borderWidth: 2,
            }]
        }
        const options = {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        fontSize: 10
                    },
                    scaleLabel: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        fontSize: 10,
                        // Include a dollar sign in the ticks
                        callback: (value: number) => {
                            return prettyN(value) + 'gps'
                        },
                        max: high / 10,
                        min: low / 10,
                        stepSize: (high - low) / 2 / 10
                    },
                    scaleLabel: {
                        display: false
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                intersect: false,
                mode: 'x' as Chart.InteractionMode,
                callbacks: {
                    label: (tooltipItem: any) => {
                        return prettyN(tooltipItem.yLabel) + 'gps'
                    },
                    title: (tooltipItem: any) => {
                        return `${labels[tooltipItem[0].index]}`
                    }
                }
            }
        };
        (this.$refs.canvas as HTMLElement).style.height = "100%"
        if (this.chart) {
            this.chart.data = data
            this.chart.options = options
            this.chart.update()
        } else {
            this.chart = new Chart(this.$refs.canvas as any, { type: 'line', data, options })
        }
    }

    async getGasLimits() {
        let savedSamples: GasLimitSample[]
        try {
            savedSamples = JSON.parse(localStorage.getItem(gasLimitSamplesKey) || '[]')
        } catch (err) {
            console.warn('load saved gas limit samples')
            savedSamples = []
        }
        const samples = await Promise.all(this.points!.map(n => {
            const i = savedSamples.find(s => s.n === n)
            if (i) {
                return i
            } else {
                return this.$svc.block(n).then(r => {
                    const b = r.block
                    return {
                        n: b.number,
                        ts: b.timestamp,
                        gl: b.gasLimit
                    }
                })
            }
        }))
        localStorage.setItem(gasLimitSamplesKey, JSON.stringify(samples))
        return samples
    }

    samplePoints() {
        const best = this.best
        const points: number[] = []
        const gap = 720
        const latestP = best.number - Math.floor((best.timestamp % 600) / 10)

        for (let i = 0; i < 12; i++) {
            points.unshift(latestP - i * gap)
        }

        this.points = points
    }

}
</script>
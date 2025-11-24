<template>
  <span>{{ time ? time : '-' }}</span>
</template>

<script>
  export default {
    props: {
      lastUpdated: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        time: this.get_time_diff(),
        interval: null
      }
    },
    mounted() {
      this.interval = setInterval(() => {
        this.time = this.get_time_diff()
      }, 1000)
    },
    beforeUnmount() {
      clearInterval(this.interval)
    },
    methods: {
      get_time_diff() {
        const datetimeTratativa = new Date(this.lastUpdated).getTime()
        const now = new Date().getTime()

        if (isNaN(datetimeTratativa)) {
          return ''
        }

        const milisec_diff = Math.abs(now - datetimeTratativa)
        return this.msToTime(milisec_diff)
      },
      msToTime(s) {
        const ms = s % 1000
        s = (s - ms) / 1000
        const secs = s % 60
        s = (s - secs) / 60
        const mins = s % 60
        const hrs = (s - mins) / 60

        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(
          secs
        ).padStart(2, '0')}`
      }
    }
  }
</script>

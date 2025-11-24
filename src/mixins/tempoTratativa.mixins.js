const tempoTratativa = {
  data: () => ({
    interval: null
  }),
  mounted() {
    this.interval = setInterval(() => {
      this.get_time_diff()
    }, 1000)
  },
  methods: {
    get_time_diff(datetimeTratativa) {
      datetimeTratativa =
        typeof datetimeTratativa !== 'undefined' ? datetimeTratativa : '2019-01-01 00:00:00.000000'

      datetimeTratativa = new Date(datetimeTratativa).getTime()
      var now = new Date().getTime()

      if (isNaN(datetimeTratativa)) {
        return ''
      }

      var milisec_diff = ''
      if (datetimeTratativa < now) {
        milisec_diff = now - datetimeTratativa
      } else {
        milisec_diff = datetimeTratativa - now
      }
      return this.msToTime(milisec_diff)
    },
    msToTime(s) {
      var ms = s % 1000
      s = (s - ms) / 1000
      var secs = s % 60
      s = (s - secs) / 60
      var mins = s % 60
      var hrs = (s - mins) / 60

      var txHora = hrs
      if (hrs <= 9) {
        txHora = '0' + txHora
      }
      var txMin = mins
      if (mins <= 9) {
        txMin = '0' + txMin
      }
      var txSec = secs
      if (secs <= 9) {
        txSec = '0' + txSec
      }
      return txHora + ':' + txMin + ':' + txSec
    }
  },
  beforeDestroy: function () {
    clearInterval(this.interval)
  }
}

export default tempoTratativa

// import "@fortawesome/fontawesome-free/css/all.css";
// import '@fortawesome/fontawesome-free/css/all.css'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'

// import Vue from 'vue'
// import Vuetify from 'vuetify/lib/framework'
import { createVuetify } from 'vuetify'
import colors from 'vuetify/lib/util/colors'

// Vue.use(Vuetify)

export default createVuetify({
  icons: {
    iconfont: 'md' || 'fa' || 'md'
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: localStorage.getItem('cor') ? localStorage.getItem('cor') : '#8f0e8f',
        secondary: '#772853',
        background: colors.grey.lighten2,
        backgroundCard: colors.grey.lighten5,
        textColorBlack: colors.grey.darken4,
        backgroundCardComentarios: colors.grey.lighten3,
        accent: colors.shades.black,
        error: colors.red.accent3,
        iconPrimary: colors.red.darken3
      }
    }
  }
})
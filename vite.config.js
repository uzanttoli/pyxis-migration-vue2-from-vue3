import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueJsx from '@vitejs/plugin-vue-jsx'
// import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  server: {
    host: true, // permite acesso externo
    port: 5173 // opcional
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 3
          }
        }
      }
    })
    // vueJsx(),
    // vuetify({ autoImport: true })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})

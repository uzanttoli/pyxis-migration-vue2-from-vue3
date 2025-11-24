<template>
  <v-dialog v-model="responderPesquisaHumor" width="700" persistent>
    <v-card color="#D9D9D9" class="rounded-xl">
      <div class="title">
        <div></div>
        <span>Como você está se sentido hoje?</span>
        <div v-if="!permiditoFecharModal"></div>
        <v-btn @click="$emit('updated:close')" icon v-if="permiditoFecharModal">
          <v-icon>fa-solid fa-xmark</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <div class="card-img">
        <div v-for="(item, i) in imgs" :key="i" @click="selectionHumor(item, i)" :id="`img-${i}`">
          <img :src="getImgUrl(item.img)" />
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div style="padding: 10px; margin-top: -15px" v-if="formAnalise.status">
        <v-autocomplete
          outlined
          dense
          class="rounded-xl"
          :items="motivosJson"
          item-text="descricao"
          color="primary"
          v-model="formAnalise.motivo"
        >
          <template v-slot:label>
            <span class="text-gray-500">
              Selecione o motivo que te faz
              <span style="font-weight: bold">{{ formAnalise.status }}</span>
            </span>
          </template>
        </v-autocomplete>
      </div>
      <div style="padding: 0 10px">
        <div style="width: 100%; display: flex; align-items: center; justify-content: end">
          <span style="font-size: 12px; color: grey">
            {{ (formAnalise.observacao && formAnalise.observacao.length) || 0 }}/255
          </span>
        </div>
        <v-textarea
          outlined
          dense
          placeholder="Compartilhe qualquer sugestão, comentário ou experiência que você ache importante."
          label="Compartilhe qualquer sugestão, comentário ou experiência que você ache importante."
          class="rounded-xl rounded-tr-0 no-counter"
          style="background-color: white"
          auto-grow
          counter="255"
          hide-details
          maxlength="255"
          v-model="formAnalise.observacao"
        ></v-textarea>
      </div>
      <div style="padding: 10px">
        <v-btn block color="success" class="rounded-xl" @click="submit">Salvar humor</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import motivos from './motivos.json'
  import { EventBus } from '@/eventBus'
  import { HumorService } from '@/data/services/Acoes'

  export default {
    props: {
      value: Boolean,
      obj: Object,
      possuiHumor: [String, Array]
    },
    data: () => ({
      ultimoElemento: null,
      responderPesquisaHumor: false,
      permiditoFecharModal: false,
      formAnalise: {
        status: null,
        motivo: null,
        observacao: null
      },
      imgs: [
        { img: 'feliz', label: 'Feliz' },
        { img: 'animado', label: 'Animado' },
        { img: 'cansado', label: 'Cansado' },
        { img: 'chateado', label: 'Chateado' },
        { img: 'triste', label: 'Triste' }
      ]
    }),
    computed: {
      motivosJson() {
        if (!this.formAnalise.status) return
        return motivos.filter(item => {
          return item.motivo.toLowerCase() == this.formAnalise.status.toLowerCase()
        })
      },
      usuario() {
        return this.$store.getters.usuario
      }
      // dialog: {
      //   get() {
      //     return this.value
      //   },
      //   set(val) {
      //     this.$emit('input', val)
      //   }
      // }
    },
    methods: {
      async loadValidacaoPesquisa() {
        // let pefilConsiderar = ['SUPERVISOR', 'OPERADOR', 'BKO_ATIVACAO', 'BACK_OFFICE']
        let perfilConsiderar = []
        if (perfilConsiderar.includes(this.usuario.filtro)) {
          var res = await HumorService.validarPesquisaHumorUsuario(this.usuario.almope)
          this.responderPesquisaHumor = res
        }
        // this.responderPesquisaHumor = false
      },
      async submit() {
        if (this.formAnalise.status == null || this.formAnalise.motivo == null) {
          EventBus.$emit('snackbar', {
            text: 'Humor e motivo precisa estar preenchidos.',
            color: 'warning',
            iconLeft: 'fa-solid fa-triangle-exclamation'
          })
          return
        }
        try {
          let obj = {
            Almope: this.usuario.almope,
            Humor: this.formAnalise.status,
            Motivo: this.formAnalise.motivo,
            Observacao: this.formAnalise.observacao
          }
          this.loadingBtn = true

          if (this.obj && this.obj.click == 'click-component' && this.possuiHumor != undefined) {
            await HumorService.atualizarPesquisaHumor(obj)
            this.$emit('updated:close')
            this.$emit('updated:atualizar')
          } else {
            await HumorService.salvarDadosHumor(obj)
            this.$emit('updated:atualizar')
          }
          EventBus.$emit('snackbar', {
            text: 'Obrigado por participar. Seu feedback é muito importante!',
            color: 'success',
            iconLeft: 'fa-solid fa-circle-check'
          })
          this.loadingBtn = false
          this.responderPesquisaHumor = false
        } catch (error) {
          console.log(error)
          EventBus.$emit('snackbar', {
            text: 'Não foi possivel salvar seus dados, tente novamente.',
            color: 'error',
            iconLeft: 'fa-solid fa-triangle-exclamation'
          })
        }
      },
      getImgUrl(icon) {
        var images = require.context('@/assets/img/humor/img-humor-2.0', false, /\.png$/)
        return images('./' + icon + '.png')
      },
      selectionHumor(item, i) {
        const element = document.getElementById(`img-${i}`)

        if (!element) return

        document.querySelectorAll('.active').forEach(el => el.classList.remove('active'))
        element.classList.add('active')

        this.formAnalise.status = item.label
      }
      // fecharDialog() {
      //   this.$emit('input', false)
      // }
    },
    watch: {
      value: function (newVal) {
        if (newVal != this.responderPesquisaHumor) {
          this.responderPesquisaHumor = newVal
          if (this.obj.click == 'click-component') {
            this.permiditoFecharModal = true
          }
        }
      },
      'formAnalise.status': function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.formAnalise.motivo = null
        }
      }
    },
    created() {
      this.$nextTick(async () => {
        await this.loadValidacaoPesquisa()
      })
    }
  }
</script>

<style scoped>
  .title {
    padding: 15px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title span {
    color: #9549ae;
    font-size: 25px;
    font-weight: bold;
  }

  .card-img {
    padding: 40px 10px;
    display: flex;
    justify-content: space-around;
  }

  .card-img div {
    text-align: center;
    width: 120px;
    cursor: pointer;
    border-bottom: 5px solid #d9d9d9;
  }

  .card-img div:hover {
    border-bottom: 5px solid #98d69b;
  }

  .card-img img {
    border-radius: 15px;
    height: 100px;
  }

  .card-img div span {
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
  }

  .card-img .active {
    border-bottom: 5px solid #388e3c;
  }
</style>

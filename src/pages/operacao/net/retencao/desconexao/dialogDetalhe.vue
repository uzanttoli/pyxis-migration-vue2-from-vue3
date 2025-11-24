<template>
  <v-dialog v-model="dialog" fullscreen>
    <v-card>
      <ComponentesPainel
        :almopeConsulta="usuarioAlmope"
        nomeUsuario="N/A"
        :perfilUsuario="perfilUsuario"
        :usuarioAlmope="usuarioAlmope"
        @update:retorno="dadosTabela"
      >
        <template v-slot:header>
          <card-app-bar
            customClass="rounded-xl"
            :minHeight="120"
            style="margin-top: 8px"
            styleCustom="display:flex; flex-direction: column; height: 120px; padding:25px; color: #fafafa;"
          >
            <template v-slot:title>
              <div style="display: flex; flex-direction: column">
                <h2>Dados referente ao almope: {{ usuarioAlmope }}!</h2>
              </div>
            </template>
            <template v-slot:subtitle>
              <p style="font-size: 12px">Acompanhe o resultado do seu operador.</p>
            </template>
            <template v-slot:imagem>
              <v-btn
                class="rounded-xl"
                @click="fecharDialog"
                style="position: absolute; bottom: 10px; right: 20px"
              >
                Sair
              </v-btn>
            </template>
          </card-app-bar>
        </template>
      </ComponentesPainel>
    </v-card>
  </v-dialog>
</template>

<script>
  import ComponentesPainel from './componentesPainel.vue'
  import cardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'
  export default {
    components: { ComponentesPainel, cardAppBar },
    props: {
      value: Boolean,
      perfilUsuario: Number,
      usuarioAlmope: Number
    },
    computed: {
      dialog: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val) // Atualiza o estado do diálogo no componente pai
        }
      }
    },
    methods: {
      fecharDialog() {
        this.$emit('input', false) // Fecha o diálogo
      },
      dadosTabela(item) {
        this.$emit('update:retorno', item)
      }
    }
  }
</script>

<style></style>

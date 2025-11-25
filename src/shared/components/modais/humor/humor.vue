<template>
  <v-card class="pa-3 mt-2" flat>
    <v-col>
      <v-row justify="space-around">
        <v-btn icon @click="ativarItem(item)" v-for="(item, i) in icons" :key="i.item">
          <v-avatar>
            <img
              :class="{ imgGray: !item.isActive }"
              :title="item.title"
              :src="getImgUrl(item.src)"
              :alt="item.alt"
              :value="item.value"
              :isActive="item.isActive"
            />
          </v-avatar>
        </v-btn>
      </v-row>
    </v-col>
    <v-col>
      <v-divider class="mt-5 mb-5"></v-divider>
      <input type="checkbox" id="ckbAnonimo" value="false" v-model="formHumor.checkboxAnonimo" />
      <label for="ckbAnonimo">
        Anônimo
        <small>
          (Quando marcada, apenas o emoticon será exibido ao gestor, a observação não será exibida)
        </small>
      </label>
      <v-divider class="mt-5 mb-5"></v-divider>
      <label v-for="(item, i) in motivosHumor" :key="i">
        <input
          @click=";(item.isSelected = !item.isSelected), itemsSelecionados()"
          type="checkbox"
          :value="item.value"
          :isSelected="item.isSelected"
        />
        {{ item.text }}
      </label>
      <v-divider class="mt-5 mb-5"></v-divider>
      <v-textarea
        filled
        auto-grow
        label="Gostaria de dividir o seu momento emocional? Por quê você se sente assim?"
        rows="4"
        row-height="30"
        shaped
        v-model="formHumor.observacaoHumor"
      ></v-textarea>
    </v-col>
    <v-card-actions>
      <v-btn
        color="green darken-1 white--text"
        @click="salvarDadosFormularioHumor()"
        :disabled="!this.formIsValid()"
      >
        Enviar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'humor-modal',
    data: () => ({
      motivosHumor: [
        {
          value: 'Qualidade Chamadas',
          text: 'Qualidade de Chamadas',
          isSelected: false
        },
        {
          value: 'Falha Internet',
          text: 'Falha Internet',
          isSelected: false
        },
        {
          value: 'Últimos Atendimentos',
          text: 'Últimos Atendimentos',
          isSelected: false
        },
        {
          value: 'Erros de Pagamento',
          text: 'Erros de Pagamento',
          isSelected: false
        },
        {
          value: 'Problemas Pessoais',
          text: 'Problemas Pessoais',
          isSelected: false
        },
        {
          value: 'Queda VPN',
          text: 'Queda VPN',
          isSelected: false
        },
        {
          value: 'Escala de Trabalho',
          text: 'Escala de Trabalho',
          isSelected: false
        },
        {
          value: 'Horário de Trabalho',
          text: 'Horario de Trabalho',
          isSelected: false
        },
        {
          value: 'Relacionamento com o Gestor',
          text: 'Relacionamento com o Gestor',
          isSelected: false
        },
        {
          value: 'Insatisfação Salarial',
          text: 'Insatisfação Salarial',
          isSelected: false
        },
        {
          value: 'Falhas Sistemas Net',
          text: 'Falhas Sistemas Net',
          isSelected: false
        },
        {
          value: 'Falhas Sistemas Claro',
          text: 'Falhas Sistemas Claro',
          isSelected: false
        },
        {
          value: 'Esgotamento Emocional',
          text: 'Esgotamento Emocional',
          isSelected: false
        }
      ],
      icons: [
        {
          title: 'Animado',
          src: 'animado',
          value: 'animado',
          alt: 'animado',
          isActive: false
        },
        {
          title: 'Bem',
          src: 'bem',
          value: 'bem',
          alt: 'bem',
          isActive: false
        },
        {
          title: 'Muito Bem',
          src: 'muito-bem',
          alt: 'Muito Bem',
          value: 'muito-bem',
          isActive: false
        },
        {
          title: 'Confiante',
          src: 'confiante',
          alt: 'confiante',
          value: 'confiante',
          isActive: false
        },
        {
          title: 'Chateado',
          src: 'chateado',
          alt: 'chateado',
          value: 'chateado',
          isActive: false
        },
        {
          title: 'Muito Chateado',
          src: 'muito-chateado',
          alt: 'Muito Chateado',
          value: 'muito-chateado',
          isActive: false
        },
        {
          title: 'Nada Bem',
          src: 'nada-bem',
          value: 'nada-bem',
          alt: 'Nada Bem',
          isActive: false
        },
        {
          title: 'Não Muito Bem',
          src: 'nao-muito-bem',
          value: 'nao-muito-bem',
          alt: 'Não Muito Bem',
          isActive: false
        }
      ],
      formHumor: {
        humor: null,
        motivosHumor: '',
        observacaoHumor: null,
        checkboxAnonimo: false
      }
    }),
    computed: {
      myHumor() {
        return this.$store.getters.myHumor
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      getImgUrl(icon) {
        var images = require.context('../../../../assets/img/humor/', false, /\.png$/)
        return images('./' + icon + '.png')
      },
      ativarItem(item) {
        this.icons.forEach(element => {
          if (element != item) {
            element.isActive = false
          }
        })
        item.isActive = true
        this.formHumor.humor = item.value
      },
      itemsSelecionados() {
        let motivosSelecionados = this.motivosHumor
          .filter(element => {
            if (element.isSelected) {
              return element
            }
          })
          .map(element => element.value)
        this.formHumor.motivosHumor = motivosSelecionados.join(',')
      },
      loadMyHumor() {
        return this.$store.dispatch('loadMyHumor', this.usuarioAlmope)
      },
      async salvarDadosFormularioHumor() {
        if (this.formHumor) {
          this.formHumor.almope = this.$store.getters.usuario.almope
          await this.$store.dispatch('salvarDadosHumor', this.formHumor)
          await this.$store.dispatch('loadImgSelecionado', this.formHumor.humor)
          localStorage.setItem('humor', this.formHumor.humor)
          await this.loadMyHumor()
          this.$emit('update:humorEnviado')
        }
      },
      formIsValid() {
        return this.formHumor.humor
      }
    }
  }
</script>

<style scoped>
  .imgGray {
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
  }
</style>

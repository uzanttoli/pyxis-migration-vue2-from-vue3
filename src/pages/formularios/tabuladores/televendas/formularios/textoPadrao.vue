<template>
  <!-- v-model="openTextoPadrao" -->
  <v-dialog
    :model-value="openTextoPadrao"
    @update:modelValue="val => $emit('update:openTextoPadrao', val)"
    width="1000"
    persistent
  >
    <v-card tile class="rounded-xl">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #fff;
          margin-bottom: 30px;
        "
        class="card-title"
      >
        <v-card-title style="font-weight: 700">Texto padrão | MK1 - VM1</v-card-title>
        <v-btn icon class="mr-2" @click="$emit('update:close'), limparForm()">
          <v-icon>fas fa-close</v-icon>
        </v-btn>
      </div>
      <v-col>
        <v-row>
          <v-col cols="3">
            <v-text-field
              placeholder="Combinação aceita pelo cliente:"
              label="Combinação aceita pelo cliente:"
              outlined
              dense
              v-model="text.combinacaoAceita"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              placeholder="Valor total"
              label="Valor total"
              outlined
              dense
              v-model="text.valorTotal"
              v-mask="['#.##', '##.##', '###.##']"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              placeholder="Valor TV"
              label="Valor TV"
              outlined
              dense
              v-model="text.valorTV"
              v-mask="['#.##', '##.##', '###.##']"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              placeholder="Valor Virtua"
              label="Valor Virtua"
              outlined
              dense
              v-model="text.valorVirtua"
              v-mask="['#.##', '##.##', '###.##']"
            ></v-text-field>
          </v-col>
          <v-col cols="3" class="mt-n6">
            <v-text-field
              placeholder="Valor Fone"
              label="Valor Fone"
              outlined
              dense
              v-model="text.valorFone"
              v-mask="['#.##', '##.##', '###.##']"
            ></v-text-field>
          </v-col>
          <v-col cols="3" class="mt-n6">
            <v-text-field
              placeholder="Valor Movel"
              label="Valor Movel"
              outlined
              dense
              v-model="text.valorMovel"
              v-mask="['#.##', '##.##', '###.##']"
            ></v-text-field>
          </v-col>
          <v-col cols="3" class="mt-n6">
            <v-select
              placeholder="Informou fidelidade?"
              label="Informou fidelidade?"
              :items="['SIM', 'NÃO']"
              outlined
              dense
              v-model="text.informouFidelidade"
            ></v-select>
          </v-col>
          <v-col cols="3" class="mt-n6">
            <v-select
              placeholder="Informou sobre o envio do chip?"
              label="Informou sobre o envio do chip?"
              :items="['SIM', 'NÃO']"
              outlined
              dense
              v-model="text.informouEnvioChip"
            ></v-select>
          </v-col>
          <v-col cols="3" class="mt-n6">
            <v-select
              placeholder="Confirmou o endereço de envio do chip?"
              label="Confirmou o endereço de envio do chip?"
              :items="['SIM', 'NÃO']"
              outlined
              dense
              v-model="text.confirmouEndereco"
            ></v-select>
          </v-col>
          <v-col cols="3" class="mt-n6">
            <v-select
              placeholder="Informou sobre o 0800 para ativação?"
              label="Informou sobre o 0800 para ativação?"
              :items="['SIM', 'NÃO']"
              outlined
              dense
              v-model="text['0800paraAtivacao']"
            ></v-select>
          </v-col>
          <v-col cols="3" class="mt-n6">
            <v-select
              placeholder="Se Portabilidade, Informou sobre o recebimento do token?"
              label="Se Portabilidade, Informou sobre o recebimento do token?"
              :items="['SIM', 'NÃO']"
              outlined
              v-model="text.recebimentoToken"
              dense
            ></v-select>
          </v-col>
          <v-col cols="3" class="mt-n6">
            <v-text-field
              placeholder="Protocolo Claro"
              label="Protocolo Claro"
              outlined
              v-mask="['#####.#####.####-#']"
              dense
              v-model="text.protocoloClaro"
            ></v-text-field>
          </v-col>
          <v-col cols="3" class="mt-n6">
            <v-text-field
              placeholder="Melhor Telefone pra contato"
              label="Melhor Telefone pra contato"
              outlined
              dense
              v-mask="['(##) ####-####', '(##) #####-####']"
              v-model="text.melhorTelefone"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="texto-padrao" v-show="gerarTexto">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <p style="font-weight: 600; font-size: 19px; margin: 8px 0 15px 8px">Texto gerado:</p>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  icon
                  style="text-align: center"
                  @click="copiarTexto"
                  v-on="on"
                  v-bind="attrs"
                >
                  <v-icon size="20">fa-solid fa-copy</v-icon>
                </v-btn>
              </template>
              <span>Copiado</span>
            </v-tooltip>
          </div>
          <span v-html="textPadraoGerado" style="font-size: 13px; margin: 10px 0"></span>
        </div>
        <v-btn @click="loadGerarTexto()" depressed :loading="isLoadGerarTexto" class="mt-n7">
          Gerar texto
        </v-btn>
        <textarea
          id="textToCopy"
          v-html="textPadraoGerado"
          v-model="textPadraoGerado"
          style="visibility: hidden"
        ></textarea>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import { Tratamento } from '../../../../../js/Tratamento'
  export default {
    props: {
      openTextoPadrao: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      gerarTexto: false,
      isLoadGerarTexto: false,
      text: {
        combinacaoAceita: '',
        valorTotal: 0,
        valorTV: 0,
        valorVirtua: 0,
        valorFone: 0,
        valorMovel: 0,
        informouFidelidade: '',
        informouEnvioChip: '',
        confirmouEndereco: '',
        '0800paraAtivacao': '',
        recebimentoToken: '',
        protocoloClaro: '',
        melhorTelefone: ''
      }
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      textPadraoGerado() {
        let nome = new Tratamento(this.usuario.nome)
        let texto = `COMBINAÇÃO ACEITA PELO CLIENTE: ${this.text.combinacaoAceita}`
        texto += ` INFORMOU O VALOR TOTAL: R$ ${this.text.valorTotal}`
        texto += ` INFORMOU OS VALORES INDIVIDUAIS APÓS VENDA: TV [R$ ${this.text.valorTV}] + BL [R$ ${this.text.valorVirtua}] + FONE [R$ ${this.text.valorFone}] + MÓVEL [R$ ${this.text.valorMovel}] `
        texto += ` INFORMOU VALORES INDIVIDUAIS: (X) SIM ( ) NÃO `
        texto += ` INFORMOU SOBRE O ENVIO DE CHIP: (${
          this.text.informouEnvioChip == 'SIM' ? 'X' : ' '
        }) SIM (${this.text.informouEnvioChip == 'NÃO' ? 'X' : ' '}) NÃO `
        texto += ` INFORMOU FIDELIDADE: (${
          this.text.informouFidelidade == 'SIM' ? 'X' : ' '
        }) SIM (${this.text.informouFidelidade == 'NÃO' ? 'X' : ' '}) NÃO `
        texto += ` ORIENTOU SOBRE 0800 E RECEBIMENTO DE CHIP: (${
          this.text['0800paraAtivacao'] == 'SIM' ? 'X' : ' '
        }) SIM (${
          this.text['0800paraAtivacao'] == 'NÃO' ? 'X' : ' '
        }) NÃO (CASO SEJA NECESSÁRIO ENVIO DE CHIP) `
        texto += ` CONFIRMOU O ENDEREÇO DE RECEBIMENTO DO CHIP: (${
          this.text.confirmouEndereco == 'SIM' ? 'X' : ' '
        }) SIM (${this.text.confirmouEndereco == 'NÃO' ? 'X' : ' '}) NÃO `
        texto += ` PARA PORTABILIDADE, INFORMOU SOBRE O TOKEN: (${
          this.text.recebimentoToken == 'SIM' ? 'X' : ' '
        }) SIM (${this.text.recebimentoToken == 'NÃO' ? 'X' : ' '}) NÃO `
        texto += ` PROTOCOLO CLARO [${this.text.protocoloClaro}] (REGISTRAR TODAS AS INFORMAÇÕES QUE FORAM PASSADAS DURANTE O ATENDIMENTO PARA O CLIENTE, COMO VALORES, PRAZOS E DATAS). `
        texto += ` CONFIRME MELHOR TELEFONE E HORÁRIO PARA CONTATO COM DDD QUE NÃO ESTEJA CADASTRADO NA LEI NÃO PERTURBE ${this.text.melhorTelefone}`
        texto += ` ${nome.myPrimaryName.toUpperCase()} / ${this.usuario.supervisor.toUpperCase()} / ${
          this.usuario.regional
        } / ALMAVIVA`
        return texto
      }
    },
    methods: {
      copiarTexto() {
        const copy = document.getElementById('textToCopy')

        copy.style.visibility = 'visible'

        copy.select()
        document.execCommand('copy')
        copy.style.visibility = 'hidden'
      },
      limparForm() {
        let newForm = Object.assign({}, this.text)
        Object.keys(newForm).forEach(item => {
          newForm[item] = ''
        })
        this.text = newForm
        this.gerarTexto = false
      },
      loadGerarTexto() {
        this.isLoadGerarTexto = true
        setTimeout(() => {
          this.gerarTexto = true
          this.isLoadGerarTexto = false
        }, 1500)
      }
    }
  }
</script>

<style scoped>
  .texto-padrao {
    background-color: #e3e3e3;
    padding: 5px;
    margin: 10px 0;
  }

  .card-title {
    background-image: linear-gradient(45deg, rgb(143, 14, 143), rgb(0, 236, 255));
    /* border-radius: 15px; */
  }
</style>

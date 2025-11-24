<template>
  <!-- v-model="adicionarDetalhesConsumo" -->
  <v-dialog
    width="400"
    persistent
    :model-value="adicionarDetalhesConsumo"
    @update:modelValue="val => $emit('update:adicionarDetalhesConsumo', val)"
  >
    <v-card>
      <v-col>
        <div style="display: flex; justify-content: end">
          <v-btn icon @click="$emit('update:close')">
            <v-icon>fas fa-close</v-icon>
          </v-btn>
        </div>
        <div class="head">
          <div class="head-info">
            <i class="fa-solid fa-bolt"></i>
            <h4>
              {{
                dadosEquipamento
                  ? dadosEquipamento.title
                  : dadosEdit
                  ? dadosEdit.equipamento
                  : false
              }}
            </h4>
          </div>
        </div>
        <div class="body">
          <label>Quantidade:</label>
          <v-text-field
            outlined
            dense
            style="border-radius: 0px"
            :placeholder="
              dadosEquipamento ? 'Informe a quantidade de ' + dadosEquipamento.title : ''
            "
            v-mask="['####']"
            v-model="formDetalhesConsumo.quantidadeEquipamento"
          ></v-text-field>
          <label>Tempo de Uso:</label>
          <div style="display: flex">
            <v-text-field
              outlined
              dense
              flat
              style="border-radius: 0px"
              placeholder="Informe o tempo de uso"
              v-model="formDetalhesConsumo.tempoUso"
              v-mask="[masks.hora]"
            ></v-text-field>
            <v-select
              outlined
              dense
              style="border-radius: 0px"
              :items="itemsConsumo"
              item-text="text"
              v-model="formDetalhesConsumo.periodoConsumo"
            ></v-select>
          </div>
          <label>Potência:</label>
          <div style="display: flex">
            <v-text-field
              outlined
              dense
              style="border-radius: 0px"
              placeholder="Informe a potência"
              v-model="formDetalhesConsumo.potencia"
              v-mask="['#####']"
            ></v-text-field>
            <v-select
              outlined
              dense
              style="border-radius: 0px"
              :items="['watts (W)']"
              v-model="formDetalhesConsumo.tipoPotencia"
            ></v-select>
          </div>
          <div>
            <v-btn block depressed @click="adicionarItem" :disabled="!formIsValid()">
              Adicionar
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import masks from '../../../../shared/masks/masks'

  export default {
    props: {
      adicionarDetalhesConsumo: {
        type: Boolean,
        default: false
      },
      dadosEquipamento: {
        type: [Array, Object]
      },
      dadosEdit: {
        type: [Array, Object]
      }
    },
    data: () => ({
      formDetalhesConsumo: {
        quantidadeEquipamento: null,
        potencia: null,
        tempoUso: null,
        periodoConsumo: 'horas/Dia',
        tipoPotencia: 'watts (W)'
      },
      itemsConsumo: [
        {
          text: 'horas/Dia'
        }
      ]
    }),
    computed: {
      masks() {
        return masks
      }
    },
    methods: {
      editItem() {
        let dadosEdit = this.dadosEdit
        if (!dadosEdit) return

        this.formDetalhesConsumo.quantidadeEquipamento = dadosEdit.quantidadeEquipamento
        this.formDetalhesConsumo.potencia = dadosEdit.potencia
        this.formDetalhesConsumo.tempoUso = dadosEdit.tempoUso
        this.formDetalhesConsumo.periodoConsumo = dadosEdit.periodoConsumo
        this.formDetalhesConsumo.tipoPotencia = dadosEdit.tipoPotencia
      },
      adicionarItem() {
        let data = {
          quantidadeEquipamento: this.formDetalhesConsumo.quantidadeEquipamento,
          potencia: this.formDetalhesConsumo.potencia,
          tempoUso: this.formDetalhesConsumo.tempoUso,
          periodoConsumo: this.formDetalhesConsumo.periodoConsumo,
          tipoPotencia: this.formDetalhesConsumo.tipoPotencia,
          equipamento: this.dadosEquipamento
            ? this.dadosEquipamento.title
            : this.dadosEdit.equipamento,
          kwhMes: this.calcularKwhMes(
            this.formDetalhesConsumo.potencia,
            this.formDetalhesConsumo.quantidadeEquipamento,
            this.formDetalhesConsumo.tempoUso
          ),
          kwhAno: this.calcularKwhAno(
            this.formDetalhesConsumo.potencia,
            this.formDetalhesConsumo.quantidadeEquipamento,
            this.formDetalhesConsumo.tempoUso
          )
        }
        this.$emit('update:detalhesConsumo', data)
      },
      calcularKwhMes(potencia, qtdEquipamento, qtdHoras) {
        return (potencia * qtdEquipamento * this.timeToDecimal(qtdHoras) * 30) / 1000
      },
      calcularKwhAno(potencia, qtdEquipamento, qtdHoras) {
        return ((potencia * qtdEquipamento * this.timeToDecimal(qtdHoras) * 30) / 1000) * 12
      },
      timeToDecimal(t) {
        const [hour, min] = t.split(':')
        const dec = parseInt((min / 6) * 10, 10)
        return parseFloat(parseInt(hour, 10) + '.' + (dec < 10 ? '0' : '') + dec)
      },
      formIsValid() {
        let fieldsValid = this.formDetalhesConsumo
        for (let item in fieldsValid) {
          if (fieldsValid[item] === null || fieldsValid[item] === '') {
            return false
          }
        }
        return true
      }
    },
    watch: {
      adicionarDetalhesConsumo: function (oldVal, newVal) {
        if (oldVal != newVal) {
          this.editItem()
        }
      }
    },
    created() {}
  }
</script>

<style scoped>
  .head {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .head-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    min-width: 130px;
    border: 1px solid #3430f0;
    border-radius: 8px;
    height: 90px;
    padding: 0 5px 0 5px;
  }

  i {
    font-size: 25px;
    margin-bottom: 4px;
    color: #3430f0;
  }
</style>

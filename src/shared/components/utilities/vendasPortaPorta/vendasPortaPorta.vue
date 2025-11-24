<template>
  <v-dialog max-width="580" v-model="dialogVendasPortaPorta" persistent>
    <v-col cols="12" class="pa-2">
      <v-card ref="form">
        <title-negative-margin title="Vendas Porta Porta">
          <v-btn icon @click.stop="$emit('closeVendasPortaPorta')">
            <!-- <v-icon>mdi-close</v-icon> -->
            <v-icon>fa-solid fa-xmark</v-icon>
          </v-btn>
        </title-negative-margin>
        <v-col cols="12">
          <v-row>
            <v-dialog
              ref="dialogDate"
              v-model="vendasPortaPorta.selectDate"
              v-model:return-value="vendasPortaPorta.date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="vendasPortaPorta.date"
                  label="Informe uma data"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="vendasPortaPorta.date" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="vendasPortaPorta.selectDate = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.dialogDate.save(vendasPortaPorta.date)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
            <v-dialog
              ref="dialogTime"
              v-model="vendasPortaPorta.selectTime"
              v-model:return-value="vendasPortaPorta.time"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="vendasPortaPorta.time"
                  label="Informe uma hora"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="vendasPortaPorta.selectTime"
                v-model="vendasPortaPorta.time"
                full-width
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="vendasPortaPorta.selectTime = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.dialogTime.save(vendasPortaPorta.time)">
                  OK
                </v-btn>
              </v-time-picker>
            </v-dialog>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-select
                :items="items"
                label="Selecione o produto"
                outlined
                v-model="vendasPortaPorta.item"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="vendasPortaPorta.cpf"
                v-mask="maskCpf"
                label="Informe o CPF"
                outlined
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="vendasPortaPorta.contratoOne"
                v-mask="maskContrato"
                label="Contrato 1"
                outlined
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="vendasPortaPorta.contratoTwo"
                v-mask="maskContrato"
                label="Contrato 2"
                outlined
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-col cols="12">
            <v-textarea
              filled
              auto-grow
              v-model="vendasPortaPorta.observacao"
              label="Observações"
              rows="4"
              row-height="30"
              shaped
            ></v-textarea>
          </v-col>
          <v-col>
            <v-row>
              <v-btn color="primary" elevation="2" :disabled="!this.formIsValid()">ENVIAR</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!this.formFilled()"
                color="red white--text"
                elevation="2"
                @click="limparVendasPortaPorta()"
              >
                LIMPAR
              </v-btn>
            </v-row>
          </v-col>
        </v-col>
      </v-card>
    </v-col>
  </v-dialog>
</template>

<script>
  import Masks from '../../../masks/masks'
  export default {
    props: {
      dialogVendasPortaPorta: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      items: ['CM', 'MTF'],

      vendasPortaPorta: {
        selectDate: null,
        selectTime: null,
        date: null,
        time: null,
        item: null,
        cpf: null,
        contratoOne: null,
        contratoTwo: null,
        observacao: null
      },
      vendasPortaPortaDefault: {
        selectDate: null,
        selectTime: null,
        date: null,
        time: null,
        item: null,
        cpf: null,
        contratoOne: null,
        contratoTwo: null,
        observacao: null
      }
    }),
    computed: {
      maskCpf() {
        let { cpf } = Masks
        return cpf
      },
      maskContrato() {
        let { contratoComCodCidade } = Masks
        return contratoComCodCidade
      }
    },
    methods: {
      toggleDialog() {
        this.dialogVendasPortaPorta = !this.dialogVendasPortaPorta
      },
      limparVendasPortaPorta() {
        Object.assign(this.vendasPortaPorta, this.vendasPortaPortaDefault)
      },
      formIsValid() {
        return (
          this.vendasPortaPorta.time &&
          this.vendasPortaPorta.date &&
          this.vendasPortaPorta.cpf &&
          this.items &&
          this.vendasPortaPorta.contratoOne &&
          this.vendasPortaPorta.contratoTwo &&
          this.vendasPortaPorta.observacao
        )
      },
      formFilled() {
        return (
          this.vendasPortaPorta.time ||
          this.vendasPortaPorta.date ||
          this.vendasPortaPorta.cpf ||
          this.vendasPortaPorta.item ||
          this.vendasPortaPorta.contratoOne ||
          this.vendasPortaPorta.contratoTwo ||
          this.vendasPortaPorta.observacao
        )
      }
    }
  }
</script>
<style></style>

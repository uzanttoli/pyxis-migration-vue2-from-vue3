<template>
  <v-dialog v-model="_dialogReset" width="400">
    <v-card>
      <v-card-title>Reset de senha</v-card-title>
      <div class="container-img">
        <img src="../../../assets/img/core/security.png" alt="" />
      </div>
      <!-- <validation-observer ref="observer" v-slot="{ invalid }"> -->
        <form @submit.prevent="submit">
          <div class="field-form">
            <!-- <ValidationProvider
              rules="required|numeric|min:7|max:7"
              v-slot="{ errors }"
              name="almope"
            > -->
              <v-text-field
                class="mx-2"
                dense
                outlined
                placeholder="Almope"
                v-mask="[masks.almope]"
                required
                v-model="formReset.almope"
                prepend-inner-icon="fa-solid fa-user"
              ></v-text-field>
            <!-- </ValidationProvider> -->
            <!-- <ValidationProvider
              rules="required|date_format:dd/MM/yyyy"
              v-slot="{ errors }"
              name="Data Nascimento"
            > -->
              <v-text-field
                class="mx-2"
                dense
                outlined
                v-mask="[masks.data]"
                placeholder="Data Nascimento"
                v-model="formReset.dataNascimento"
                required
                prepend-inner-icon="fa-solid fa-calendar-days"
              ></v-text-field>
            <!-- </ValidationProvider> -->
            <!-- <ValidationProvider v-slot="{ errors }" name="Nova Senha" rules="required|min:8"> -->
              <v-text-field
                class="mx-2"
                dense
                outlined
                placeholder="Nova Senha"
                v-model="formReset.novaSenha"
                required
                prepend-inner-icon="fa-solid fa-lock"
              ></v-text-field>
            <!-- </ValidationProvider> -->
          </div>
          <v-col cols="pa-0 ma-0">
            <v-row class="mb-2 mt-n3" style="margin: 0 1px 0 1px">
              <v-btn type="submit" block depressed color="success">
                Alterar
              </v-btn>
            </v-row>
          </v-col>
        </form>
      <!-- </validation-observer> -->
    </v-card>
  </v-dialog>
</template>
<script>
  // import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import Masks from '../../../shared/masks/masks'
  import axios from 'axios'
  import alerts from '../../../mixins/alerts.mixins'
  export default {
    // components: { ValidationObserver, ValidationProvider },
    props: {
      dialogReset: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      formReset: {
        almope: '',
        dataNascimento: '',
        novaSenha: ''
      }
    }),
    mixins: [alerts],
    computed: {
      _dialogReset: {
        get() {
          return this.dialogReset
        },
        set(newVal) {
          return newVal
        }
      },
      masks() {
        return Masks
      }
    },
    methods: {
      async submit() {
        const isValid = this.$refs.observer.validate()
        if (isValid) {
          let urlData = `http://172.16.252.214:4200/index.php/api/reset/password/`
          var res = await axios.post(urlData, this.formReset)

          if (res.data.status == 'success') {
            this.clearForm()
            this.$emit('update:close-reset')
          }
          this.toast(res.data.message, 'top-right', false, 3000, res.data.status)
          requestAnimationFrame(() => {
            this.$refs.observer.reset()
          })
        }
      },
      clearForm() {
        let newForm = Object.assign({}, this.formReset)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formReset = newForm
      }
    }
  }
</script>
<style scoped>
  input:valid {
    border-color: green;
  }

  input:invalid {
    border-color: red;
  }

  .container-img {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  img {
    width: 200px;
  }

  .action-form {
    display: flex;
    justify-content: center;
    margin-top: -10px;
  }
</style>

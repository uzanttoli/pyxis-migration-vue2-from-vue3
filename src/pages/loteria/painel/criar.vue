<template>
  <div class="container-configuracao">
    <div>
      <v-btn
        class="my-2 white--text"
        @click="adicionarConcurso"
        :disabled="form.length > 4"
        elevation="0"
        color="deep-purple accent-4"
      >
        Adicionar outro concurso
        <v-icon color="white" class="ml-1">fa-solid fa-circle-plus</v-icon>
      </v-btn>
      <v-col class="mt-2">
        <div class="btn-selection-pub">
          <div class="selection">
            <p style="margin: 0">Como gostaria de direcionar esse concurso?</p>
            <selecao-publico @update:public-alvo="publicSelecionado"></selecao-publico>
          </div>
        </div>
        <v-row v-for="(item, i) in form" :key="i" align="center">
          <v-col>
            <v-text-field-component
              label="Concurso"
              placeholder="Concurso"
              v-model="item.concurso"
              propsMasks="loteria"
              :isMasks="true"
            ></v-text-field-component>
          </v-col>
          <v-col>
            <v-text-field-component
              label="Data Inicio"
              placeholder="Data Inicio"
              v-model="item.dataInicio"
              propsMasks="data"
              :isMasks="true"
            ></v-text-field-component>
          </v-col>
          <v-col>
            <v-text-field-component
              label="Data Fim"
              placeholder="Data Fim"
              v-model="item.dataFim"
              propsMasks="data"
              :isMasks="true"
            ></v-text-field-component>
          </v-col>
          <v-col>
            <v-text-field-component
              label="Data Sorteio"
              placeholder="Data Sorteio"
              v-model="item.dataSorteio"
              propsMasks="data"
              :isMasks="true"
            ></v-text-field-component>
          </v-col>
          <v-col>
            <v-text-field-component
              label="Total Bolinhas p/ resgate"
              placeholder="Total Bolinhas p/ resgate"
              v-model="item.bolinhasResgate"
            ></v-text-field-component>
          </v-col>
          <v-col>
            <div>
              <label style="font-size: 13px; color: gray">Descrição Prêmio</label>
              <v-text-field
                label="Descrição do prêmio"
                placeholder="Descrição do prêmio"
                solo
                dense
                class="rounded-bl-xl rounded-r-xl"
                v-model="item.descPremio"
              ></v-text-field>
            </div>
          </v-col>
          <v-col>
            <v-autocomplete
              label="Público"
              placeholder="Público"
              v-model="item.regional"
              :items="dadosPublico"
              text="PUBLICO"
              value2="PUBLICO"
              :multiple="publicSelected == 'REGIONAL' ? true : false"
            ></v-autocomplete>
          </v-col>
          <v-btn v-if="i != 0" @click="removerConcurso(i)" icon color="deep-purple accent-4">
            <v-icon>fa-solid fa-circle-minus</v-icon>
          </v-btn>
        </v-row>
        <v-row>
          <div style="width: 99vw">
            <v-col>
              <v-row>
                <v-col v-if="!imageData">
                  <div class="upload-banner" @click="openInput">
                    <div class="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24">
                        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                        <g
                          stroke-linejoin="round"
                          stroke-linecap="round"
                          id="SVGRepo_tracerCarrier"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            fill=""
                            d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div class="text">
                      <span>Escolher imagem</span>
                    </div>
                  </div>

                  <div class="py-2">
                    <v-chip class="font-weight-medium mr-2">
                      Tamanho necessário
                      <strong class="ml-1">1757 x 300</strong>
                    </v-chip>
                    <v-tooltip right>
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          :href="downloadModelo('ModeloBannerPyxis.png')"
                          color="green"
                          rounded
                          fab
                          x-small
                        >
                          <v-icon color="white">fas fa-download</v-icon>
                        </v-btn>
                      </template>
                      <span>Baixar Modelo</span>
                    </v-tooltip>
                  </div>
                </v-col>
                <v-col v-if="imageData">
                  <div class="preview-upload-banner" @click="openInput">
                    <div>
                      <p>Imagem selecionada, para mudar clique novamente!</p>
                    </div>
                    <img :src="imageData" />
                    <div class="py-2">
                      <v-chip class="font-weight-medium mr-2">
                        Tamanho necessário
                        <strong class="ml-1">1757 x 300</strong>
                      </v-chip>
                      <v-tooltip right>
                        <template v-slot:activator="{ attrs, on }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            :href="downloadModelo('ModeloBannerPyxis.png')"
                            color="green"
                            rounded
                            fab
                            x-small
                          >
                            <v-icon color="white">fas fa-download</v-icon>
                          </v-btn>
                        </template>
                        <span>Baixar Modelo</span>
                      </v-tooltip>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-row justify="end" class="mx-2">
                <v-btn @click="limparForm" class="rounded-bl-xl rounded-r-xl mr-2" color="error">
                  Limpar formulario
                </v-btn>

                <v-btn
                  class="rounded-bl-xl rounded-r-xl"
                  color="success"
                  @click="criarBilhete"
                  :disabled="!this.formularioValido()"
                >
                  Criar Bilhete
                </v-btn>
              </v-row>
            </v-col>
          </div>
        </v-row>
      </v-col>
    </div>
    <input
      type="file"
      ref="inputFileCreateBilhete"
      style="display: none"
      accept=".png, .jpg, .jpeg"
      @change="dadosFile"
    />
  </div>
</template>

<script>
  import VAutocomplete from '../../../shared/components/vuetifyComponents/VAutocomplete.vue'
  import VTextFieldComponent from '../../../shared/components/vuetifyComponents/VTextField.vue'
  import config from '../../../core/config'

  import alerts from '../../../mixins/alerts.mixins'
  import SelecaoPublico from './selecaoPublico.vue'
  import masks from '../../../shared/masks/masks'
  export default {
    components: { VTextFieldComponent, VAutocomplete, SelecaoPublico },
    mixins: [alerts],
    data: () => ({
      qtdConcursos: 1,
      form: [
        {
          concurso: '',
          dataInicio: '',
          dataFim: '',
          dataSorteio: '',
          descPremio: '',
          regional: '',
          bolinhasResgate: 999
        }
      ],
      imageData: null,
      fileName: null,
      arquivoUpload: null,
      publicSelected: 'REGIONAL',
      dadosPublico: [],
      regionais: []
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      masks() {
        return masks
      }
    },
    methods: {
      async publicSelecionado(e) {
        if (this.publicSelected != e) {
          this.publicSelected = await e
          this.loadDadosPublicoSelecionado()
        }
      },
      downloadModelo(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_banner/${img}`
      },
      formularioValido() {
        let formulario = this.form
        let camposPreenchidos = formulario.every(objeto => {
          return Object.values(objeto).every(valor => valor != '')
        })
        return camposPreenchidos
      },
      limparForm() {
        let formulario = this.form
        this.imageData = null
        this.fileName = null
        this.arquivoUpload = null
        formulario.map(e => {
          e.concurso = ''
          e.dataInicio = ''
          e.dataFim = ''
          e.dataSorteio = ''
          e.descPremio = ''
          e.regional = ''
        })
      },
      tratarPublico(value) {
        if (!value) return
        let list = value.map(item => item).join('; ')
        return list
      },
      // loadRegionais() {
      //   let urlData = `${config.baseUrl}api/shared/regional/portal`;
      //   this.$api.get(urlData).then((res) => {
      //     this.regionais = res.data;
      //   });
      // },
      loadDadosPublicoSelecionado() {
        let urlData = `${config.baseUrl}api/shared/loteria/configuracao/dados_publico_selecionado/${this.publicSelected}`
        this.$api.get(urlData).then(res => {
          this.dadosPublico = res.data
        })
      },
      criarBilhete() {
        let dados = this.form
        let newDados = dados.map(e => {
          return {
            concurso: e.concurso,
            dataInicio: e.dataInicio,
            dataFim: e.dataFim,
            dataSorteio: e.dataSorteio,
            descPremio: e.descPremio,
            bolinhasResgate: e.bolinhasResgate,
            alvoBilhete:
              this.publicSelected == 'REGIONAL' ? this.tratarPublico(e.regional) : e.regional,
            tipoAlvoBilhete: this.publicSelected,
            imagemBanner: this.fileName,
            usuarioCadastro: this.usuarioAlmope
          }
        })
        if (this.arquivoUpload != null) {
          const formData = new FormData()
          formData.append('imagem', this.arquivoUpload)
          let urlUpload = `${config.baseUrl}api/shared/loteria/configuracao/upload_arquivo/222`
          this.$api
            .post(urlUpload, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(() => {})
        }

        let urlData = `${config.baseUrl}api/shared/loteria/configuracao/criar_bilhete/`
        this.$api.post(urlData, newDados).then(() => {
          this.toast('Bilhete criado com sucesso!', 'bottom-right', true, 3500, 'success')
          this.limparForm()
        })
      },
      generateHashName() {
        const date = new Date()
        return date.getTime().toString()
      },
      dadosFile(e) {
        let file = e.target.files[0]
        const hashName = this.generateHashName()
        const newName = `img_bilhete_${hashName}`

        const fileExtension = file.name.split('.').pop()

        const renamedFile = new File([file], `${newName}.${fileExtension}`, {
          type: file.type
        })

        this.fileName = `${renamedFile.name}`
        this.arquivoUpload = renamedFile
        var reader = new FileReader()
        reader.onload = e => {
          this.imageData = e.target.result
        }
        reader.readAsDataURL(renamedFile)
      },
      openInput() {
        this.$refs.inputFileCreateBilhete.click()
      },
      adicionarConcurso() {
        this.form.push({
          concurso: '',
          dataInicio: '',
          dataFim: '',
          dataSorteio: '',
          descPremio: '',
          regional: '',
          bolinhasResgate: 999
        })
      },
      removerConcurso(index) {
        this.form.splice(index, 1)
      }
    },
    created() {
      // this.loadRegionais();
      this.loadDadosPublicoSelecionado()
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Syne&display=swap"); */
  .container-configuracao {
    padding: 20px;
  }
  h2 {
    font-family: 'Syne', sans-serif;
  }
  .upload-banner {
    padding: 30px;
    height: 300px;
    border: 2px dashed #cacaca;
    border-radius: 10px;
    /* margin: 10px; */

    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }
  .icon svg {
    height: 80px;
    fill: rgba(75, 85, 99, 1);
  }

  .text {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text span {
    font-weight: 400;
    color: rgba(75, 85, 99, 1);
  }

  img {
    width: 100%;
    height: 100%;
  }

  .preview-upload-banner {
    padding: 7px;
    height: 300px;
    border: 2px dashed #cacaca;
    border-radius: 10px;
    cursor: pointer;
  }

  .preview-upload-banner > div {
    position: absolute;
    display: flex;
    align-items: center;
    border: 1px solid white;
    background: white;
    padding: 4px;
    margin: 4px;
    /* visibility: hidden; */
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .preview-upload-banner div p {
    color: #656363;
    margin: 0;
    font-weight: bold;
  }
  .preview-upload-banner:hover > div {
    /* visibility: visible; */
    opacity: 1;
  }

  .btn-selection-pub {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-bottom: 10px;
  }
  .selection {
    display: flex;
    align-items: center;
    border: 1px solid #656363;
    border-radius: 5px;
    padding: 0 5px;
  }

  .btn-selection-pub p {
    font-size: 12px;
    font-weight: 600;
    color: #656363;
  }
</style>

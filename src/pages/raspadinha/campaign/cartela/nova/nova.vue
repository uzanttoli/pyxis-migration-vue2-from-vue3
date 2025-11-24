<template>
  <v-card class="rounded-xl pa-8" :loading="loading">
    <div class="d-flex flex-row justify-between align-center">
      <Title icon="fa-solid fa-receipt" title="Nova Cartela" />
    </div>
    <v-container>
      <v-col lg="6" offset-lg="3">
        <div>
          <v-stepper v-model="currentStep">
            <v-stepper-header>
              <v-stepper-step step="1" :complete="cardSavedSuccessfully">
                Crie a Cartela
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="2" :complete="prizesSavedSuccessfully">
                Adicione os Prêmios
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3">Realize o Sorteio</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <!-- # STEP 1 -->
              <v-stepper-content step="1">
                <v-form ref="form" v-model="valid">
                  <v-row>
                    <v-col cols="4">
                      <div class="d-flex justify-space-between">
                        <v-text-field
                          label="Título"
                          :rules="[rules.required]"
                          v-model="drawForm.title"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div class="d-flex justify-space-between">
                        <v-text-field
                          label="Total de cartões gerados"
                          :rules="[rules.required]"
                          v-model="drawForm.scratchCardAmount"
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        label="Total de cartões premiados"
                        :rules="[rules.required]"
                        v-model="drawForm.scratchCardWinningAmount"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <UploadFile
                        v-model="drawForm.image"
                        :key="uploadFileKey"
                        :nospacing="true"
                        :elevate="true"
                      />
                    </v-col>
                    <v-col cols="12" class="d-flex">
                      <v-spacer />
                      <CustomButtonRoot
                        plain
                        color="success"
                        depressed
                        :loading="loading"
                        @click="submitDrawForm()"
                      >
                        <CustomButtonWithText text="Continuar" />
                        <CustomButtonWithIcon
                          color="white"
                          class="mx-2"
                          icon="fa-solid fa-arrow-right"
                        />
                      </CustomButtonRoot>
                    </v-col>
                  </v-row>
                </v-form>
              </v-stepper-content>

              <!-- # STEP 2 -->
              <v-stepper-content step="2">
                <v-form ref="form" v-model="valid">
                  <v-row class="d-flex justify-between align-center">
                    <v-col cols="6">
                      <div class="d-flex justify-space-between">
                        <v-text-field label="Título" v-model="currentPrize.title"></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div class="d-flex justify-space-between">
                        <v-text-field label="Valor R$" v-model="currentPrize.value"></v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <template v-if="prizes.length < drawForm.scratchCardWinningAmount">
                        <b>{{ drawForm.scratchCardWinningAmount - prizes.length }}</b>
                        prêmios pendentes de cadstro.
                      </template>
                      <div v-else>Todos os prêmios foram cadastrados.</div>
                    </v-col>

                    <v-col cols="12">
                      <UploadFile
                        v-model="currentPrize.image"
                        :key="uploadFileKey"
                        :nospacing="true"
                        :elevate="true"
                      />
                    </v-col>
                    <v-col
                      v-if="prizes.length < drawForm.scratchCardWinningAmount"
                      cols="12"
                      class="d-flex justify-end"
                    >
                      <CustomButtonRoot
                        plain
                        color="success"
                        depressed
                        :loading="loading"
                        @click="addPrize()"
                      >
                        <CustomButtonWithText text="Adicionar Prêmio" />
                        <CustomButtonWithIcon color="white" class="mx-2" icon="fa-solid fa-gifts" />
                      </CustomButtonRoot>
                    </v-col>
                    <v-col cols="12">
                      <v-data-table
                        no-data-text="Não há dados no momento"
                        :headers="headers"
                        :items="prizes"
                      >
                        <template v-slot:item.actions="{ item }">
                          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                        </template>
                      </v-data-table>
                    </v-col>
                    <v-col
                      v-if="drawForm.scratchCardWinningAmount == prizes.length"
                      cols="12"
                      class="d-flex"
                    >
                      <v-spacer />
                      <CustomButtonRoot
                        xl
                        plain
                        color="success"
                        depressed
                        :loading="loading"
                        @click="submitPrizes()"
                      >
                        <CustomButtonWithText text="Continuar" />
                        <CustomButtonWithIcon
                          color="white"
                          class="mx-2"
                          icon="fa-solid fa-arrow-right"
                        />
                      </CustomButtonRoot>
                    </v-col>
                  </v-row>
                </v-form>
              </v-stepper-content>

              <!-- # STEP 3 -->
              <v-stepper-content step="3">
                <v-row>
                  <v-col cols="12" class="d-flex justify-center align-center h-60">
                    <div class="diamond-container">
                      <div class="diamond">
                        <div class="diamond-top"></div>
                        <div class="diamond-bottom"></div>
                      </div>
                      <div class="sparkles">
                        <div class="one">✨</div>
                        <div class="two">✨</div>
                      </div>
                    </div>

                    <CustomButtonRoot
                      plain
                      color="#70ced4"
                      depressed
                      :disabled="loading"
                      :loading="loading"
                      @click="generateCards()"
                    >
                      <CustomButtonWithText text="Sortear" color="white" />
                      <CustomButtonWithIcon color="white" class="mx-2" icon="fa-solid fa-clover" />
                    </CustomButtonRoot>
                  </v-col>
                </v-row>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </div>
      </v-col>
    </v-container>
  </v-card>
</template>

<script>
  // Mixins
  import alerts from '@/mixins/alerts.mixins'
  // Services
  import FileService from '@/data/services/file/fileService'
  import ScratchCardService from '@/data/services/scratchCard/ScratchCardService'
  import PrizesService from '@/data/services/scratchCard/PrizesService'
  import DrawFormService from '@/data/services/scratchCard/DrawCardService'
  //Componentes
  import Title from '@/shared/components/Title/Title.vue'
  import UploadFile from '@/shared/components/UploadFile/UploadFile.vue'
  import { CustomButton } from '@/shared/components/Button'
  // Enums e Utils
  import { ImageFileTypes } from '@/enums/imageTypes'
  import generateUUID from '@/utils/UUID.js'

  export default {
    name: 'NovaCartela',
    components: {
      Title,
      UploadFile,
      CustomButtonRoot: CustomButton.Root,
      CustomButtonWithText: CustomButton.WithText,
      CustomButtonWithIcon: CustomButton.WithIcon
    },
    mixins: [alerts],
    data() {
      return {
        loading: false,
        currentStep: 1,
        cardSavedSuccessfully: false,
        prizesSavedSuccessfully: false,
        uploadFileKey: 0,
        drawForm: {
          id: null,
          title: '',
          scratchCardAmount: null,
          scratchCardWinningAmount: null,
          image: null,
          campaign: this.$route.params.campaignId
        },
        currentPrize: {
          id: '',
          title: '',
          image: null,
          drawFormId: null,
          value: null
        },
        prizes: [],
        acceptedTypes: 'image/*',
        rules: {
          required: value => !!value || 'Obrigatório.'
        },
        valid: false,
        headers: [
          { text: 'Título', value: 'title', align: 'center' },
          { text: 'Imagem', value: 'image.name', align: 'center' }
        ]
      }
    },
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      hasPermission() {
        return this.usuario.filtro != 'OPERADOR'
      }
    },
    methods: {
      async submitDrawForm() {
        this.loading = true
        try {
          const payload = {
            ...this.drawForm,
            id: generateUUID(),
            title: this.drawForm.title,
            scratchCardAmount: this.drawForm.scratchCardAmount,
            scratchCardWinningAmount: this.drawForm.scratchCardWinningAmount
          }
          this.drawForm.id = payload.id

          const drawFormResponse = await DrawFormService.insert(payload)
          const lastInsertedId = drawFormResponse.data.id
          if (lastInsertedId) {
            if (this.drawForm.image) {
              this.uploadImage(this.drawForm.image, lastInsertedId, 'raspadinhaCartela')
            }
            this.cardSavedSuccessfully = true
            this.nextStep()
          }
        } catch (error) {
          this.toast(error, 'top-right', false, 3500, 'error')
        } finally {
          this.loading = false
        }
      },
      async submitPrizes() {
        try {
          this.loading = true
          await PrizesService.batchInsert(this.prizes)
          const updatedPrizes = this.prizes.map(prize => {
            if (prize.image) {
              const fileExtension = prize.image.name.split('.').pop()
              const renamedFile = new File([prize.image], `${prize.id}.${fileExtension}`, {
                type: prize.image.type
              })
              return { ...prize, image: renamedFile }
            } else {
              return prize
            }
          })

          const imagesToUpload = updatedPrizes
            .filter(prize => prize.image)
            .map(prize => prize.image)

          await this.uploadImagesBatch('raspadinhaPremio', imagesToUpload)
          this.prizesSavedSuccessfully = true
          this.nextStep()
        } catch (error) {
          this.toast(error, 'top-right', false, 3500, 'error')
        } finally {
          this.loading = false
        }
      },
      addPrize() {
        this.prizes.push({
          id: generateUUID(),
          title: this.currentPrize.title,
          image: this.currentPrize.image,
          drawFormId: this.drawForm.id,
          value: this.currentPrize.value
        })

        this.currentPrize = {
          id: '',
          title: '',
          image: null,
          drawFormId: null,
          value: null
        }
      },
      async generateCards() {
        try {
          this.loading = true
          const generatedPrizes = await ScratchCardService.generateCards(
            this.drawForm.id,
            this.drawForm.scratchCardAmount
          )
          if (generatedPrizes.length === 0) {
            this.toast('Falha ao gerar cartões de raspadinha', 'top-right', false, 3500, 'error')
            return
          }
          await this.assignRandomAwards()
        } catch (error) {
          this.toast(error, 'top-right', false, 3500, 'error')
          this.$router.push(`/pyxis/raspadinha/campanha/${this.$route.params.campaignId}/Cartelas`)
        }
      },
      async assignRandomAwards() {
        try {
          this.loading = true
          await ScratchCardService.assignRandomAwards(
            this.prizes.map(prize => prize.id).join(','),
            this.drawForm.id
          )
        } catch (error) {
          this.toast(error, 'top-right', false, 3500, 'error')
        } finally {
          this.$router.push(`/pyxis/raspadinha/campanha/${this.$route.params.campaignId}/Cartelas`)
        }
      },
      clearCurrentPrizeImage() {
        this.currentPrize.image = null
        this.uploadFileKey += 1
      },
      nextStep() {
        this.currentStep++
      },
      clearFile() {
        this.drawForm.image = null
      },
      handleUploadImage(file) {
        this.drawForm.image = file
      },
      handleAddPrizeImage(file) {
        this.currentPrize.image = file
      },
      async uploadImage(image, lastInsertedId, folderName) {
        const fileExtension = image.name.split('.').pop()
        const renamedFile = new File([image], `${lastInsertedId}.${fileExtension}`, {
          type: image.type
        })

        this.extension = fileExtension

        if (!Object.values(ImageFileTypes).includes(fileExtension)) {
          this.toast('Tipo inválido', 'top-right', false, 3500, 'error')
          return
        }

        await FileService.upload(folderName, renamedFile)
        this.toast('Imagem salva com sucesso', 'top-right', false, 3000, 'success')
      },
      async uploadImagesBatch(folder, files) {
        if (!folder || !files || files.length === 0) {
          return
        }

        try {
          const response = await FileService.uploadBatch(folder, files)
          return response
        } catch (error) {
          console.error('Erro ao realizar o upload das imagens:', error)
          throw error
        }
      }
    },
    async mounted() {
      if (!this.hasPermission) {
        this.$router.push('/')
      }
    }
  }
</script>

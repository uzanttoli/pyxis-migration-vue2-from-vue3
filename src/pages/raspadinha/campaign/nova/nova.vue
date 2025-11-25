<template>
  <v-card class="rounded-xl pa-8" :loading="loading">
    <div class="d-flex flex-row justify-between align-center">
      <UiTitle icon="fa-solid fa-receipt" title="Nova Campanha" />
    </div>
    <v-container>
      <v-col lg="6" offset-lg="3">
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="4">
              <div class="d-flex justify-space-between">
                <v-text-field
                  label="Título da Campanha"
                  :rules="[rules.required]"
                  v-model="campaign.title"
                ></v-text-field>
              </div>
            </v-col>
            <v-col cols="4">
              <DatePickerRange
                v-model:dates="campaign.dates"
                v-model:showDatePicker="showDatePicker"
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="rolePermissionSchema"
                :rules="[rules.required]"
                :items="Object.keys(ROLE_PERMISSION)"
                label="Seleciona a regra de permissão"
                @change="rolePermissionSchema = $event"
              />
            </v-col>

            <v-col cols="4">
              <v-textarea
                v-if="rolePermissionSchema === ROLE_PERMISSION.ALMOPE"
                placeholder="Cole uma lista com os almopes aqui..."
                label="Cole uma lista com os almopes aqui..."
                required
                rows="1"
                v-model="campaign.almopeList"
              ></v-textarea>

              <v-autocomplete
                v-if="rolePermissionSchema === ROLE_PERMISSION.REGIONAL"
                label="Selecione pra quais regionais a campanha ficará disponível"
                placeholder="Selecione pra quais regionais a campanha ficará disponível"
                hide-no-data
                :items="regionais"
                item-text="CAMPANHA"
                item-value="CAMPANHA"
                v-model="campaign.selectedRegions"
                multiple
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0" small>{{ item.CAMPANHA }}</v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
                    (+{{ campaign.selectedRegions.length - 1 }}
                    outros)
                  </span>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <UploadFile
                v-model="campaign.image"
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
                @click="submit()"
              >
                <CustomButtonWithText text="Salvar" />
                <CustomButtonWithIcon color="white" class="mx-2" icon="fa-solid fa-arrow-up" />
              </CustomButtonRoot>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-container>
  </v-card>
</template>

<script>
  // Mixins
  import alerts from '@/mixins/alerts.mixins'
  // Services
  import FileService from '@/data/services/file/fileService'
  import CampaignService from '@/data/services/scratchCard/CampaignService'
  import ScratchCardPermissionsService from '@/data/services/scratchCard/Permissions'
  //Componentes
  import UiTitle from '@/shared/components/Title/Title.vue'
  import UploadFile from '@/shared/components/UploadFile/UploadFile.vue'
  import DatePickerRange from '@/shared/components/DatePicker/DatePickerRange.vue'
  import { CustomButton } from '@/shared/components/Button'
  // Enums e Utils
  import { ROLE_PERMISSION } from '@/enums/RolePermission'
  import { ImageFileTypes } from '@/enums/imageTypes'
  import generateUUID from '@/utils/UUID.js'

  export default {
    name: 'NovaCampanha',
    components: {
      UiTitle,
      UploadFile,
      DatePickerRange,
      CustomButtonRoot: CustomButton.Root,
      CustomButtonWithText: CustomButton.WithText,
      CustomButtonWithIcon: CustomButton.WithIcon
    },
    mixins: [alerts],
    data() {
      return {
        loading: false,
        showDatePicker: false,
        uploadFileKey: 1,
        campaign: {
          id: null,
          title: '',
          dates: [],
          almopeList: null,
          selectedRegions: null,
          image: null
        },
        maxSize: 5,
        acceptedTypes: 'image/*',
        rules: {
          required: value => !!value || 'Obrigatório.'
        },
        valid: false,
        rolePermissionSchema: '',
        ROLE_PERMISSION: ROLE_PERMISSION
      }
    },
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      hasPermission() {
        return this.usuario.filtro != 'OPERADOR'
      },
      regionais() {
        return this.$store.getters.regionais
      }
    },
    methods: {
      async submit() {
        this.loading = true
        try {
          const payload = {
            ...this.campaign,
            id: generateUUID(),
            startDate: this.campaign.dates[0],
            endDate: this.campaign.dates[1]
          }
          const campaignResponse = await CampaignService.insert(payload)
          const lastInsertedId = campaignResponse.data.id
          if (lastInsertedId) {
            // Verifica se há imagem e faz o upload
            if (this.campaign.image) {
              const fileExtension = this.campaign.image.name.split('.').pop()
              const renamedFile = new File(
                [this.campaign.image],
                `${lastInsertedId}.${fileExtension}`,
                {
                  type: this.campaign.image.type
                }
              )

              this.extension = fileExtension

              if (!Object.values(ImageFileTypes).includes(fileExtension)) {
                this.toast('Tipo inválido', 'top-right', false, 3500, 'error')
                return
              }

              await FileService.upload('raspadinha', renamedFile)
              this.toast('Imagem salva com sucesso', 'top-right', false, 3000, 'success')
            }

            // Cria as permissões por regional
            if (this.campaign.selectedRegions && this.campaign.selectedRegions.length > 0) {
              const permissionPayload = {
                id: lastInsertedId,
                roleId: this.campaign.selectedRegions,
                roleType: ROLE_PERMISSION.REGIONAL
              }
              await ScratchCardPermissionsService.insert(permissionPayload)
            }

            // Cria as permissões por ALMOPE
            if (this.campaign.almopeList && this.campaign.almopeList.length > 0) {
              const permissionPayload = {
                id: lastInsertedId,
                roleId: this.campaign.almopeList.split('\n').filter(line => line.trim() !== ''),
                roleType: ROLE_PERMISSION.ALMOPE
              }
              await ScratchCardPermissionsService.insert(permissionPayload)
            }

            this.$router.push(`/pyxis/raspadinha/campanha/${lastInsertedId}/cartelas/nova`)
          }
        } catch (error) {
          this.toast(error, 'top-right', false, 3500, 'error')
        } finally {
          this.loading = false
        }
      },
      clearFile() {
        this.campaign.image = null
      },
      handleUploadImage(file) {
        this.campaign.image = file
      },
      /**
       * Carrega as regionais.
       * @returns {Promise} - Promessa que resolve quando as regionais são carregadas.
       */
      loadRegionais() {
        return this.$store.dispatch('loadRegionais')
      }
    },
    async mounted() {
      if (!this.hasPermission) {
        this.$router.push('/')
      }
      this.loadRegionais()
    }
  }
</script>

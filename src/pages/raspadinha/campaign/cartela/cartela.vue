<template>
  <v-card class="rounded-xl pa-8" :loading="loading" :key="updateKey">
    <Title
      icon="fa-solid fa-id-card"
      title="Pontos Disponíveis:"
      :value="summary.PONTOS_DISPONIVEIS || '0'"
      class="mb-16"
    />

    <v-dialog v-if="currentCard" v-model="showScratchCard" persistent max-width="400">
      <v-card class="bg-scratch-card">
        <div class="d-flex flex-column justify-center align-center pa-8">
          <ScratchCard lg :disableScratch="summary.PONTOS_DISPONIVEIS <= 0" :item="currentCard" />
          <v-btn icon @click="handleCloseScratchCard" class="my-4">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-col>
      <InfinityScroll :items="infinityScrollItems" />
    </v-col>

    <PaginationComponent
      class="mb-8"
      :total="paginationData.total"
      :limit="paginationData.limit"
      v-model:page="paginationData.page"
      @page-changed="paginate($event)"
    />

    <div v-if="items && items.length" class="d-flex flex-row flex-wrap gap-3 justify-center">
      <ScratchCard
        v-for="(item, index) in items"
        :disableScratch="summary.PONTOS_DISPONIVEIS <= 0"
        :key="item.ID"
        :item="item"
        @update:item="handleOpenConfirmModal($event, index)"
      />
      <!-- @update:item="handleUpdateItem($event, index)" -->
    </div>
    <v-card class="pa-8 text-center" v-else elevation="0">
      Nenhum cartão de raspadinha encontrado
    </v-card>

    <PaginationComponent
      class="mt-8"
      :total="paginationData.total"
      :limit="paginationData.limit"
      :page="paginationData.page"
      @page-changed="paginate($event)"
    />

    <ConfirmModal
      :dialog="confirmScratchModal"
      :title="`CONFIRMAR?`"
      :text="`Deseja abrir esse cartão de raspadinha? Essa ação não poderá ser desfeita.`"
      maxWidth="400"
      confirmModal
      @update:dialog="confirmScratchModal = false"
      @action="openScratchCard()"
    />
  </v-card>
</template>

<script>
  import Vue from 'vue'
  import ScratchCard from '@/shared/components/ScratchCard/ScratchCard.vue'
  import ConfirmModal from '@/shared/components/ConfirmModal/ConfirmModal.vue'

  import Title from '@/shared/components/Title/Title.vue'
  import PaginationComponent from '@/shared/components/Pagination/PaginationComponent.vue'
  import ScratchCardService from '@/data/services/scratchCard/ScratchCardService'
  import CreditoCartelaPremiadaService from '@/data/services/scratchCard/CreditoCartelaPremiadaService'
  import InfinityScroll from '@/shared/components/InfinityScroll/InfinityScroll.vue'

  export default {
    name: 'Cartela',
    components: {
      ScratchCard,
      Title,
      PaginationComponent,
      ConfirmModal,
      InfinityScroll
    },
    props: {
      scratchCardNumber: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        loading: false,
        confirmScratchModal: false,
        showScratchCard: false,
        currentCard: {},
        currentCardIndex: null,
        paginationData: {
          page: this.$route.query.page ? parseInt(this.$route.query.page) : 1,
          limit: 500,
          total: 2500
        },
        updateKey: 1,
        items: {
          type: Array,
          default: () => []
        },
        infinityScrollItems: [],
        summary: {}
      }
    },
    computed: {
      currentPage: {
        get() {
          return this.paginationData.page
        },
        set(value) {
          this.paginationData.page = value
        }
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async handleCloseScratchCard() {
        if (this.summary.PONTOS_DISPONIVEIS <= 0) return
        this.showScratchCard = false
        this.updateKey++
      },
      handleOpenConfirmModal(item, index) {
        this.currentCard = item
        this.currentCardIndex = index
        this.confirmScratchModal = true
      },
      async openScratchCard() {
        this.confirmScratchModal = false
        const cardResponse = await ScratchCardService.scratch(
          this.$route.params.id,
          this.currentCard.ID,
          this.usuario.almope
        )
        this.items.splice(this.currentCardIndex, 1, cardResponse)
        Vue.set(this, 'currentCard', cardResponse)
        await this.fetchData(this.paginationData.page, this.paginationData.limit)
        this.showScratchCard = true
      },
      async paginate(event) {
        Vue.set(this.paginationData, 'page', event)
        this.$router.push({ query: { ...this.$route.query, page: event } })
        await this.fetchData(this.paginationData.page, this.paginationData.limit)
      },
      async fetchData(page = 1, limit = 500) {
        try {
          this.loading = true
          const id = this.$route.params.id
          const summaryResponse = await CreditoCartelaPremiadaService.getSummary(
            id,
            this.usuario.almope
          )
          Vue.set(this, 'summary', summaryResponse)
          const response = await ScratchCardService.getAll(id, page, limit)
          Vue.set(this, 'items', response.data)
          const responseAwarded = await ScratchCardService.getAllAwarded(id)

          const tempAwarded = responseAwarded.map((item, index) => {
            const newItem = {
              title: item.NOME,
              imgSrc: `http://10.64.175.49:4300/receptivo/index.php/api/arquivos/get_arquivo_2/raspadinhaPremio/${item.IMAGE}.png`,
              alt: item.TITLE || 'Prêmio ' + index + 1,
              description: item.DESCRIPTION || 'Prêmio ' + index + 1,
              highlight: true
            }
            return newItem
          })

          const tempPrizes = []
          for (let index = 0; index < 10; index++) {
            const newItem = {
              title: 'Prêmio ' + (index + 1),

              imgSrc: require(`@/assets/img/campanhas/raspadinha/s2s/premios/${index + 1}.png`),
              alt: 'Prêmio ' + index + 1,
              description: 'Prêmio ' + index + 1,
              highlight: false
            }
            tempPrizes.push(newItem)
          }

          this.infinityScrollItems = [...tempPrizes, ...tempAwarded]

          Vue.set(this, 'awarded', responseAwarded)
          this.paginationData = {
            page: response.page,
            limit: response.limit,
            total: response.total
          }
          this.loading = false
        } catch (error) {
          this.loading = false
          console.error(error)
        }
      }
    },
    async created() {
      await this.fetchData(this.paginationData.page, this.paginationData.limit)
    }
  }
</script>

<style scoped>
  .bg-scratch-card {
    place-content: center;
    background-image: linear-gradient(220deg, rgb(143, 14, 143), rgb(0, 236, 255));
  }
</style>

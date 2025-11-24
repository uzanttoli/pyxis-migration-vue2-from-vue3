<template>
  <v-card ref="form">
    <title-negative-margin title="Links Rapido" className="rounded-r-xl">
      <div>
        <input type="text" placeholder="Pesquisar" v-model="search" />
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px">
          <v-btn
            small
            shaped
            @click="changeStatus('ativo')"
            :color="status == 'ativo' ? 'success' : ''"
          >
            Ativos
          </v-btn>
          <v-btn
            small
            shaped
            @click="changeStatus('inativo')"
            :color="status == 'inativo' ? 'error' : ''"
          >
            Inativos
          </v-btn>
        </div>
      </div>
    </title-negative-margin>
    <v-divider></v-divider>
    <v-card height="500" class="overflow-auto">
      <div>
        <ul style="display: flex; flex-wrap: wrap; justify-content: space-evenly">
          <a
            v-for="(item, i) in itemsFilter"
            :key="i"
            id="link"
            target="_blank"
            :class="item.STATUS == 0 ? 'link-inativo' : 'link-ativo'"
          >
            <li @click="pushLink(item.LINK, item.STATUS)">
              <i :class="item.ICONE"></i>
              {{ item.TITLE }}
            </li>
          </a>
        </ul>
      </div>
    </v-card>
  </v-card>
</template>

<script>
  const titleNegativeMargin = () => import('../../titles/titleNegativeMargin.component.vue')
  import config from '../../../../core/config'
  export default {
    props: {
      dialogLinksRapido: {
        type: Boolean,
        Default: false
      }
    },
    components: {
      titleNegativeMargin
    },
    data: () => ({
      items: [],
      search: '',
      status: 'ativo'
    }),
    computed: {
      itemsFilter() {
        let itemFilter = []
        let statusAtual = this.status == 'ativo' ? 1 : 0

        let itemStatus = this.items.filter(item => {
          if (item.STATUS == statusAtual) {
            return item
          }
        })

        itemFilter = itemStatus.filter(item => {
          return item.TITLE.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })

        return itemFilter
      }
    },
    methods: {
      changeStatus(status) {
        this.status = status
      },
      pushLink(link, status) {
        if (status == 0) return
        let a = document.querySelector('#link')
        a.href = link
        a.click()
      },
      loadLinks() {
        let urlData = `${config.baseUrl}api/shared/utils/geral/links`
        this.$api.get(urlData).then(res => {
          this.items = res.data
        })
      }
    },
    created() {
      this.loadLinks()
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Inconsolata&display=swap"); */
  .text-no {
    text-decoration: none;
    font-size: 1rem;
  }

  .link-inativo {
    width: 250px;
    padding: 15px;
    margin: 5px;

    text-decoration: none;
    list-style: none;
    cursor: pointer;
    background-color: #d1d1d1;
    border-bottom: 2px solid #f70b03;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .link-ativo {
    width: 250px;
    padding: 15px;
    margin: 5px;

    text-decoration: none;
    list-style: none;
    cursor: pointer;
    transition: background 1s;
    border-bottom: 2px solid #6b8e23;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .link-ativo:hover {
    background-color: #333;
    color: #fff;
    border-bottom: 2px solid #5fff15;
  }

  a {
    text-decoration: none;
    color: #333;
    font-family: Inconsolata;
    font-weight: 600;
    font-size: 17px;
  }

  input {
    width: 250px;
    padding: 5px;
    margin: 2px 0px;
    border: 1px solid #c4c4c4;
    border-radius: 5px;
  }

  input::placeholder {
    left: 10px;
  }

  input:focus {
    outline: none;
  }
</style>

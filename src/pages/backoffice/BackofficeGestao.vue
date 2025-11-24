<template>
  <section>
    <search-base
      @update:field="eventBase"
      @update:is-search="search"
      @update:reload-list-ope="listOperReload"
    ></search-base>
    <distribuicao-atividades-component
      :arrayParameters="parametersSelected"
      :isSearch="initializeSearch"
      :reloadListOper="produtoListOper"
    ></distribuicao-atividades-component>
    <loadhastag :envioDados="initializeSearch" :activeMsg="true" :msg="msg" />
  </section>
</template>

<script>
  import DistribuicaoAtividadesComponent from './gestao/DistribuicaoAtividades.component.vue'
  import searchBase from './gestao/SearchBase.component.vue'
  import loadhastag from '../../shared/components/load/loadHastag.vue'
  export default {
    components: { searchBase, DistribuicaoAtividadesComponent, loadhastag },
    data: () => ({
      parametersSelected: [],
      initializeSearch: false,
      produtoListOper: null,
      msg: 'Aguarde enquanto carregamos...'
    }),
    methods: {
      eventBase(items) {
        return (this.parametersSelected = items)
      },
      search(e) {
        this.initializeSearch = e
      },
      listOperReload(e) {
        this.produtoListOper = e
      }
    }
  }
</script>

<style></style>

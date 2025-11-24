<template>
  <div>
    <div class="equipamentos">
      <i class="fa-solid fa-circle-chevron-left left"></i>
      <div
        v-for="(item, i) in equipamentos"
        :key="i"
        :class="
          selecionado
            ? selecionado.title == item.title && adicionarDetalhesConsumo
              ? 'items-selecionado'
              : 'items'
            : 'items'
        "
        @click="equipamentoSelecionado(item)"
      >
        <div style="display: flex; justify-content: center; padding: 10px">
          <i
            class="fa-solid fa-bolt"
            :class="
              selecionado
                ? selecionado.title == item.title && adicionarDetalhesConsumo
                  ? 'icon-selecionado'
                  : ''
                : ''
            "
          ></i>
        </div>
        <div style="text-align: center">
          <span class="title-equipamentos">{{ item.title }}</span>
        </div>
      </div>
      <i class="fa-solid fa-circle-chevron-right rigth"></i>
    </div>
    <dialog-adicionar-detalhes-consumo
      :adicionarDetalhesConsumo="adicionarDetalhesConsumo"
      @update:close="adicionarDetalhesConsumo = !adicionarDetalhesConsumo"
      :dadosEquipamento="selecionado"
      @update:detalhesConsumo="detalhesFormConsumo"
    ></dialog-adicionar-detalhes-consumo>
  </div>
</template>

<script>
  import dialogAdicionarDetalhesConsumo from './dialogAdicionarDetalhesConsumo.vue'
  export default {
    components: { dialogAdicionarDetalhesConsumo },
    data: () => ({
      selecionado: null,
      adicionarDetalhesConsumo: false,
      equipamentos: [
        {
          title: 'Lampadas',
          potencia: 60
        },
        {
          title: 'Tomadas',
          potencia: 100
        },
        {
          title: 'Chuveiros',
          potencia: 4400
        },
        {
          title: 'Microondas',
          potencia: 1500
        },
        {
          title: 'Ferro de Passar',
          potencia: 1000
        },
        {
          title: 'Máq. de Lavar',
          potencia: 2500
        },
        {
          title: 'Forno Elétrico',
          potencia: 1500
        },
        {
          title: 'Ar Condicionado',
          potencia: 1100
        }
      ]
    }),
    methods: {
      detalhesFormConsumo(event) {
        this.$emit('update:detalhesConsumo', event)
      },
      equipamentoSelecionado(item) {
        this.adicionarDetalhesConsumo = true
        this.selecionado = item
      }
    }
  }
</script>

<style scoped>
  .equipamentos {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;

    padding: 10px;
  }

  .items-selecionado {
    width: 130px;
    border: 1px solid #3430f0;
    background-color: #322fc9;
    color: white;
    border-radius: 8px;
    height: 75px;
    padding: 0 2px 0 2px;
    cursor: pointer;
  }

  .items {
    width: 130px;
    border: 1px solid #3430f0;
    border-radius: 8px;
    height: 75px;
    padding: 0 2px 0 2px;
    cursor: pointer;
  }

  .items:hover {
    background-color: #f0f0f0;
  }

  .title-equipamentos {
    font-size: 12px;
  }

  .rigth,
  .left {
    font-size: 25px;
    color: #e0e0e0;
  }

  i {
    font-size: 25px;
    color: #3430f0;
  }

  .icon-selecionado {
    font-size: 25px;
    color: #f1f1f1;
  }
</style>

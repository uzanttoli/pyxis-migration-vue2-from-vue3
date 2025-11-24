<template>
  <div class="demais-ranking">
    <div style="width: 100%">
      <table class="tabela">
        <thead>
          <tr>
            <th>Posição</th>
            <th>Avatar</th>
            <th>Almope</th>
            <th>Nome</th>
            <th>Vendas</th>
          </tr>
        </thead>
        <tbody v-if="demaisRanking != ''">
          <tr
            v-for="(item, i) in demaisRanking"
            :key="i"
            class="fade"
            :class="usuarioAlmope == item.ALMOPE_OP ? 'my-position' : ''"
          >
            <td>
              <span>
                <i class="fa-solid fa-hashtag"></i>
                {{ i + 4 }}
                <i :class="comparePosition(item)"></i>
              </span>
            </td>
            <td>
              <img
                v-if="item && item.NOME_AVATAR"
                :src="imagemPerfil(item ? item.NOME_AVATAR : '')"
                alt=""
              />
              <img v-else src="../../../assets/img/Avatar/padrao.png" alt="" />
            </td>
            <td>
              {{ item && item.ALMOPE_OP ? item.ALMOPE_OP : '' }}
            </td>
            <td>
              {{ item && item.NOME_OP ? item.NOME_OP : '' }}
            </td>
            <td>
              {{ item && item.VENDAS ? item.VENDAS : 0 }}
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5">As vendas ainda não foram computadas...</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      demaisRanking: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      visibleRows: []
    }),
    computed: {
      listVendendoresCache() {
        let itemExist = JSON.parse(localStorage.getItem('vendedores-cache'))
        return itemExist
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      comparePosition(object) {
        for (let i = 0; i < this.listVendendoresCache?.length; i++) {
          if (this.listVendendoresCache[i].ALMOPE_OP == object.ALMOPE_OP) {
            if (this.listVendendoresCache[i].ORDEM * 1 > object.ORDEM * 1) {
              return 'fa-solid fa-arrow-up green--text'
            } else if (this.listVendendoresCache[i].ORDEM * 1 < object.ORDEM * 1) {
              return 'fa-solid fa-arrow-down red--text'
            } else if (this.listVendendoresCache[i].ORDEM * 1 == object.ORDEM * 1) {
              return 'fa-solid fa-equals'
            }
          }
        }

        return 'fa-solid fa-arrow-up green--text'
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      }
    },
    created() {}
  }
</script>

<style scoped>
  .demais-ranking {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 20px;
    gap: 10px;
    width: 35vw;
    min-width: 25vw;
    background-color: rgb(28, 26, 66);
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 15%;
  }
  .head {
    background-color: rgb(28, 26, 55);
    color: #fff;
    font-weight: 600;
    margin: 10px 10px -10px 10px;
    padding: 15px;
    display: flex;
    justify-content: space-evenly;
  }

  i {
    margin-right: 3px;
  }

  .tabela {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .tabela th,
  .tabela td {
    padding: 2px;
    text-align: center;
    color: #fff;
    border-bottom: 3px solid rgb(28, 26, 66);
    transition: background-color 0.5s ease;
  }

  .tabela tbody tr:nth-child(even) {
    background-color: rgb(44, 42, 78);
  }

  .tabela tbody tr:nth-child(odd) {
    background-color: rgb(44, 42, 78);
  }

  /* .tabela tbody tr:hover {
  background-color: rgb(206, 140, 17)
} */

  .my-position {
    animation: spinning82341 1.7s linear infinite;
  }

  @keyframes spinning82341 {
    0% {
      background-color: rgb(206, 140, 17);
    }
    75% {
      background-color: rgb(44, 42, 78);
    }
    100% {
      background-color: rgb(206, 140, 17);
    }
  }
</style>

<template>
  <div class="mt-2 pb-5">
    <div
      style="
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 10px;
      "
    >
      <img style="margin-bottom: 5px" :src="getImg(img)" alt="" />
      <v-chip small>{{ tipoPlano }}</v-chip>
    </div>
    <div>
      <ul>
        <li>
          <span style="font-weight: 600">Franquia:</span>
          {{ gb }}
        </li>
        <li>
          <span style="font-weight: 600">Valor:</span>
          R$
          {{ valorConcorrente }}
        </li>
        <li>
          <span style="font-weight: 600">Valor GB:</span>
          R$ {{ valorGb }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      img: {
        type: String,
        default: ''
      },
      gb: {
        type: [Number, String],
        default: 0
      },
      valorConcorrente: {
        type: [Number, String],
        default: 0
      },
      valorGb: {
        type: [Number, String],
        default: 0
      },
      tipoPlano: {
        type: String,
        default: 'Indisponivel'
      }
    },
    methods: {
      getImg(img) {
        let convertImg = img == 'VIVO PÓS' || img == 'VIVO CONTROLE' ? 'vivo' : 'tim'
        let imagem = require.context('../../assets/img/core/', false, /\.png$/)
        return imagem('./' + convertImg + '.png')
      }
    }
  }
</script>

<style scoped>
  img {
    width: 70px;
  }
  ul {
    padding: 0 12px 0 18px;
  }

  ul li {
    list-style: none;
    text-decoration: none;
  }
</style>

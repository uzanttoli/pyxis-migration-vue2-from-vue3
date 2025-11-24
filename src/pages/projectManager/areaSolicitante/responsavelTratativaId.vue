<template>
  <v-card class="rounded-lg pa-3" elevation="1">
    <div>
      <v-card-title>
        <i
          class="fa-solid fa-id-badge"
          style="margin-left: -10px; margin-right: 10px; color: #262626ba"
        ></i>
        Responsável pela tratativa
      </v-card-title>
      <v-divider></v-divider>
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-top: 10px;
        "
        v-if="listInfo.NOME_USUARIO_DESIGNADO"
      >
        <v-avatar size="100">
          <!-- <v-img :src="imagemPerfil(listInfo.NOME_AVATAR)"></v-img> -->
          <v-img src="../../../assets/img/Avatar/padrao.png"></v-img>
        </v-avatar>
        <div>
          <p class="py-3 pa-0 ma-0" style="align-items: center; text-transform: capitalize">
            <i class="fa-solid fa-user" style="color: #333"></i>
            {{ listInfo.NOME_USUARIO_DESIGNADO.toLowerCase() }}
          </p>
          <!-- <p class="mt-n3 pa-0 ma-0" style="align-items: center;">
            <i class="fa-solid fa-envelope" style="color: #3333;"></i>
            {{ listInfo.EMAIL }}
          </p> -->
        </div>
      </div>
      <div v-else style="display: flex; align-items: center; flex-direction: column">
        <v-card-text
          class="text-lg-h5"
          style="position: absolute; text-align: center; margin-top: -5px"
        >
          Solicitação ainda não foi atribuída.
        </v-card-text>
        <div style="height: 250px; display: flex; justify-content: center; margin-top: 20px">
          <img style="height: 100%" src="../../../assets/img/geral/notFound.png" alt="" />
        </div>
        <p style="padding: 0; margin: 0">
          <i class="fa-regular fa-clock" style="color: #262626ba"></i>
          Prazo:
          <v-chip small>
            <span style="font-weight: 600">
              {{ listInfo.SLA_FINAL | dataFormated }}
            </span>
          </v-chip>
        </p>
      </div>
    </div>
  </v-card>
</template>

<script>
  export default {
    props: {
      listInfo: {
        type: [Array, Object]
      }
    },
    filters: {
      dataFormated: function (value) {
        if (!value) return
        return (
          value.split(' ')[0].split('-').reverse().join('/') + ' ' + value.split(' ')[1].slice(0, 5)
        )
      }
    },
    methods: {
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      }
    }
  }
</script>

<style></style>

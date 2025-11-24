<template>
  <div class="top_vendedores">
    <div class="segundo">
      <div class="info-head">
        <span style="color: rgb(222, 212, 226)">2º</span>
        <img
          v-if="list[1] && list[1].NOME_AVATAR"
          :src="imagemPerfil(list[1] && list[1].NOME_AVATAR)"
          alt="John"
        />
        <img v-else src="../../../assets/img/Avatar/padrao.png" alt="" />
        <p style="font-size: 20px">
          {{ formatedName(list[1] && list[1].NOME_OP ? list[1].NOME_OP : '') }}
        </p>
        <p class="mt-n5" style="font-size: 23px">
          {{ list[1] && list[1].ALMOPE_OP ? list[1].ALMOPE_OP : '' }}
        </p>
      </div>
      <div class="infoCard">
        <span>{{ list[1] && list[1].VENDAS ? list[1].VENDAS : 0 }} Vendas</span>
        <i class="fa-solid fa-medal"></i>
      </div>
    </div>
    <div class="primeiro">
      <div class="info-head">
        <span style="color: rgb(225, 171, 87); font-size: 46px; left: 1px; top: -30px">1º</span>
        <img
          v-if="list[0] && list[0].NOME_AVATAR"
          :src="imagemPerfil(list[0] && list[0].NOME_AVATAR)"
          alt="John"
        />
        <img v-else src="../../../assets/img/Avatar/padrao.png" alt="" />
        <p style="font-size: 20px">
          {{ formatedName(list[0] && list[0].NOME_OP ? list[0].NOME_OP : '') }}
        </p>
        <p class="mt-n5" style="font-size: 23px">
          {{ list[0] && list[0].ALMOPE_OP ? list[0].ALMOPE_OP : '' }}
        </p>
      </div>
      <div class="infoCard">
        <span>{{ list[0] && list[0].VENDAS ? list[0].VENDAS : 0 }} Vendas</span>
        <i class="fa-solid fa-trophy"></i>
      </div>
    </div>
    <div class="terceiro">
      <div class="info-head">
        <span style="color: rgb(194, 118, 52)">3º</span>
        <img
          v-if="list[2] && list[2].NOME_AVATAR"
          :src="imagemPerfil(list[2] && list[2].NOME_AVATAR)"
          alt="John"
        />
        <img v-else src="../../../assets/img/Avatar/padrao.png" alt="" />
        <p style="font-size: 20px">
          {{ formatedName(list[2] && list[2].NOME_OP ? list[2].NOME_OP : '') }}
        </p>
        <p class="mt-n5" style="font-size: 23px">
          {{ list[2] && list[2].ALMOPE_OP ? list[2].ALMOPE_OP : '' }}
        </p>
      </div>
      <div class="infoCard">
        <span>{{ list[2] && list[2].VENDAS ? list[2].VENDAS : 0 }} Vendas</span>
        <i class="fa-solid fa-medal"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        required: true
      }
    },
    methods: {
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      formatedName(string) {
        if (!string) return
        let nome = string.split(' ')
        let sobrenome = nome[1][0]
        return `${nome[0]} ${sobrenome}.`
      }
    }
  }
</script>

<style scoped>
  .top_vendedores {
    display: flex;
    align-items: end;
    gap: 10px;
  }

  .segundo,
  .primeiro,
  .terceiro {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 165px;
    height: 165px;
    padding: 3px;
    border-radius: 50%;
    background: rgb(82, 78, 237);
  }

  .primeiro img {
    width: 160px;
    padding: 3px;
    /* border: 1px solid ; */
    border-radius: 50%;
    background: rgb(246, 140, 32);
  }

  .primeiro .infoCard {
    background: rgb(246, 140, 32);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: flex;
    width: 225px;
    height: 260px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }

  .segundo .infoCard {
    background: rgb(82, 78, 237);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: flex;
    width: 225px;
    height: 210px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }

  .info-head {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .info-head span {
    color: #fff;
    font-size: 40px;
    font-weight: 600;
    position: absolute;
    left: 10px;
    top: -25px;
  }

  .terceiro .infoCard {
    background: rgb(82, 78, 237);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: flex;
    width: 225px;
    height: 175px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }

  i {
    font-size: 65px;
    color: #fff;
  }

  .infoCard {
    gap: 50px;
  }

  .infoCard span {
    font-size: 27px;
    font-weight: 600;
    color: #fff;
  }

  .fa-trophy {
    font-size: 120px;
  }

  p {
    font-weight: 600;
    color: #fff;
  }
</style>

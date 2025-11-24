<template>
  <div class="card-info">
    <div class="informacoes">
      <p v-if="filtro == 'OPERADOR'">
        Ops! Parece que você ainda não possui um concurso cadastrado. No momento, isso significa que
        você não poderá participar do Bilhete Premiado. No entanto, não se preocupe. Sugerimos que
        você entre em contato com seu gestor e solicite a criação de uma ação personalizada
        especialmente para você!
      </p>
      <p v-else>
        Ops! Parece que você ainda não pode participar dos concursos, isso significa que todos
        Bilhete Premiado disponiveis no momento é exclusivo para os operadores. Porém, você poderá
        acompanhar o andamento dos bilhetes no card acima!
      </p>
    </div>
    <div class="image">
      <img src="../../assets/img/imgCards/600ac50d07dd9cfa8dc3b7cf_robot.svg" />
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      filtro() {
        return this.$store.getters.usuario.filtro
      }
    }
  }
</script>

<style scoped>
  .card-info {
    z-index: 1;
    width: 1170px;
    height: 516px;
    background-color: #2a2699;
    border-radius: 28px;
    flex-direction: row;
    justify-content: flex-start;
    align-self: center;
    align-items: center;
    margin-top: 160px;
    margin-left: 10px;
    margin-right: 30px;
    display: flex;
    position: relative;
    bottom: 0px;
  }

  .informacoes {
    width: 50%;
    color: white;
    padding: 20px;
  }

  .informacoes p {
    font-size: 18px;
  }

  .image {
    max-width: 100%;
    display: inline-block;
  }

  .image img {
    margin-bottom: 110px;
  }
</style>

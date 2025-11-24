<template>
  <transition enter-active-class="animated fadeInDown">
    <div class="card" v-if="visible">
      <div class="tools">
        <div class="circle">
          <span class="red box"></span>
        </div>
        <div class="circle">
          <span class="yellow box"></span>
        </div>
        <div class="circle">
          <span class="green box"></span>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <div class="card__content">
        {{ msg }}
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      msg: {
        type: String,
        default: 'Dados Enviado com sucesso!'
      }
    },
    data: () => ({}),
    methods: {},
    watch: {}
  }
</script>

<style scoped>
  /* From cssbuttons.io by @EmmaxPlay */
  .card {
    width: 250px;
    height: 100px;
    position: absolute;
    top: 60px;
    right: 1px;
    margin-right: 10px;
    background-color: #c3ceda;
    border-radius: 8px;
    z-index: 1;
  }

  .tools {
    display: flex;
    align-items: center;
    padding: 9px;
  }

  .circle {
    padding: 0 4px;
  }

  .box {
    display: inline-block;
    align-items: center;
    width: 10px;
    height: 10px;
    padding: 1px;
    border-radius: 50%;
  }

  .red {
    background-color: #ff605c;
  }

  .yellow {
    background-color: #ffbd44;
  }

  .green {
    background-color: #00ca4e;
  }
  .card__content {
    padding: 15px;
  }
</style>

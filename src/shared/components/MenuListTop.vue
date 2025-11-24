<template>
  <v-col>
    <div class="menu-container">
      <ul id="myMenuList" class="menu-list">
        <li v-for="(item, i) in itemsMenu" :key="i">
          <button class="menu-btn">
            {{ selecionado ? `${item.relatorio} > ${selecionado}` : item.relatorio }}
            <i class="fa-solid fa-angle-down"></i>
          </button>
          <ul v-for="(subItem, j) in item.subItem" :key="j">
            <li @click="toggleMenu(subItem.value)">{{ subItem.text }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </v-col>
</template>

<script>
  export default {
    props: {
      itemsMenu: {
        type: Array,
        default: () => [],
        required: true
      }
    },
    data: () => ({
      selecionado: null
    }),
    methods: {
      toggleMenu(item) {
        this.selecionado = item
        this.$emit('input', item)
      }
    }
  }
</script>

<style scoped>
  .menu-container {
    width: 100%;
    padding: 20px;
  }

  .menu-list {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 20px;
  }

  .menu-list > li {
    position: relative;
  }

  .menu-btn {
    padding: 10px 20px;
    background-color: #d219a4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  .menu-btn:hover {
    background-color: #1565c0;
  }

  .menu-list li ul {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    padding: 8px 0;
    min-width: 150px;
    z-index: 1000;
    list-style: none;
  }

  .menu-list li:hover ul {
    display: block;
  }

  .menu-list li ul li {
    padding: 8px 16px;
    cursor: pointer;
  }

  .menu-list li ul li:hover {
    background-color: #f5f5f5;
  }
</style>

<style scoped>
  .menu-list {
    display: flex;
    gap: 40px;
    list-style: none;
  }

  .menu-btn {
    background-color: #4caf50;
    color: #fff;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    text-align: left;
  }
</style>

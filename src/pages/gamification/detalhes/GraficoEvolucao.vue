<template>
  <v-row class="card-historico">
    <v-col>
      <v-card class="mx-auto rounded-xl">
        <v-card-title>Minha Evolução</v-card-title>
        <div>
          <apexchart width="500" type="bar" :options="options" :series="series"></apexchart>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    data: () => ({
      options: {
        // chart: {
        //   id: "vuechart-example",
        // },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      },
      series: [
        {
          // name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    })
  }
</script>

<style scoped>
  img {
    position: absolute;
    top: 50px;
    width: 500px;
    right: 10px;
  }

  .card-historico {
    justify-content: center;
    padding: 10px;
    margin-left: 2px;
  }
</style>

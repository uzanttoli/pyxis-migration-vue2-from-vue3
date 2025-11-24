<template>
  <ul style="list-style: none; padding: 0; margin: 0">
    <li>
      <div
        style="
          display: flex;
          justify-content: space-between;
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 2px;
        "
        v-if="title"
      >
        <span style="width: 50%; display: flex; align-items: center">
          <v-icon v-if="title" size="20" color="orange" class="mr-2">
            fa-solid fa-chart-simple
          </v-icon>
          <h4>{{ title }}</h4>
        </span>
        <span style="width: 25%; text-align: right">
          <h4>{{ valueTitle ? valueTitle : '' }}</h4>
        </span>
        <span style="width: 25%; text-align: right">
          <h4>{{ percentageTitle ? percentageTitle : '' }}</h4>
        </span>
      </div>
    </li>
    <ul style="list-style: none; padding: 0; margin: 0">
      <li>
        <div
          style="display: flex; justify-content: space-between; margin-top: 5px; padding: 0 10px"
          v-if="subtitle"
        >
          <v-icon v-if="subtitle" size="17" color="grey">fa-regular fa-bookmark</v-icon>
          <span style="width: 50%" class="text-capitalize text-body-2 ml-1">
            {{ subtitle && subtitle.toLowerCase() }}
          </span>
          <span style="width: 25%; text-align: right">{{ value ? value : '' }}</span>
          <span style="width: 25%; text-align: right">{{ percentage ? percentage : '' }}%</span>
        </div>
      </li>
    </ul>
  </ul>
</template>

<script>
  export default {
    name: 'ListStyles',
    props: {
      title: {
        type: String
      },
      valueTitle: {
        type: [Number, String]
      },
      percentageTitle: {
        type: [Number, String]
      },
      subtitle: {
        type: String,
        default: ''
      },
      value: {
        type: [Number, String]
      },
      percentage: {
        type: [Number, String]
      }
    }
  }
</script>

<style scoped></style>

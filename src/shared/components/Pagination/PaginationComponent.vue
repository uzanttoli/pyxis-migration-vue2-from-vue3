<template>
  <div class="text-center">
    <v-pagination :value="page" :length="totalPages" circle @input="onPageChange"></v-pagination>
  </div>
</template>

<script>
  export default {
    name: 'PaginationComponent',
    props: {
      total: {
        type: Number,
        required: true
      },
      limit: {
        type: Number,
        required: true
      },
      page: {
        type: Number,
        required: true
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.total / this.limit)
      }
    },
    methods: {
      onPageChange(newPage) {
        this.$emit('page-changed', newPage)

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }
  }
</script>

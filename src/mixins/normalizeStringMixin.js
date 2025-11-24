const normalizeStringMixin = {
  methods: {
    normalizeString(value) {
      if (!value) return
      return value.replaceAll('_', ' ')
    }
  }
}
export default normalizeStringMixin

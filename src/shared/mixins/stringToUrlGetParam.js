const stringToUrlGetParam = {
  methods: {
    spaceToUnderscore(param) {
      return param.replace(' ', '_')
    },
    replaceUrlMultiParamSeparator(param) {
      return param.replace(';', '|')
    }
  }
}

export default stringToUrlGetParam

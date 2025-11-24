/**
 * @namespace numbersFormat
 */
const numbersFormat = {
  methods: {
    /**
     * Formats a number as a percentage string.
     * @function percentage
     * @memberof numbersFormat.methods
     * @param {number} value - The number to format.
     * @returns {string} The formatted percentage string.
     */
    percentage: function (value) {
      if (value) {
        let val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '%'
      }
      return '0%'
    },

    /**
     * Converts a number to a Brazilian decimal percentage string.
     * @function convertToDecimalBR
     * @memberof numbersFormat.methods
     * @param {number} valor - The number to convert.
     * @returns {string} The formatted decimal percentage string.
     */
    convertToDecimalBR(valor) {
      return (valor / 100).toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 2
      })
    },

    /**
     * Formats a number as Brazilian currency.
     * @function moneyBr
     * @memberof numbersFormat.methods
     * @param {number} valor - The number to format.
     * @returns {string} The formatted currency string.
     */
    moneyBr(valor) {
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })
    }
  }
}

export default { numbersFormat }

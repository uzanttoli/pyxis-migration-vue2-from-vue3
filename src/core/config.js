const baseUrl = 'http://172.16.252.214:4200/index.php/'
const fileIOUrl = 'http://10.64.175.49:4300/receptivo/index.php/'
// const pyxisReceptivoUrl = process.env.VUE_APP_PYXIS_RECEPTIVO_API;

// DEV
// const pyxisReceptivoUrl = 'http://localhost:5009/api/';

// PROD
// const pyxisReceptivoUrl = 'http://172.16.252.214:5000/api/';

// VALIDACAO SE DEV OU PROD
const pyxisReceptivoUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5009/api/'
    : process.env.VUE_APP_PYXIS_RECEPTIVO_API

export default { baseUrl, fileIOUrl, pyxisReceptivoUrl }

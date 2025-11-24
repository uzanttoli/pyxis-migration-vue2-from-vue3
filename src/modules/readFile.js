function readFilesArquive(caminho) {
  let fs = require('fs-extra')
  // let caminho =
  //   "//172.16.252.214/htdocs/receptivo/application/controllers/api/upload/erroPagamento/teste.csv";
  fs.readFile(caminho, function (err, data) {
    if (err) throw err
    return console.log(data.toString())
  })
}

export default {
  readFilesArquive
}

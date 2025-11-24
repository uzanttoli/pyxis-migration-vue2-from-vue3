// import jwt from "jsonwebtoken";
var jwt = require('jsonwebtoken')

export function gerarToken(
  chaveSecreta = '123456645',
  payload = { id: '123', nome: 'Joao' },
  options = { expiresIn: '1h' }
) {
  const token = jwt.sign(payload, chaveSecreta, options)

  const descriToken = jwt.verify(token, chaveSecreta, (err, decoded) => {
    if (err) {
      console.log(err)
    }

    return decoded
  })

  console.log(descriToken)
}

// gerarToken();

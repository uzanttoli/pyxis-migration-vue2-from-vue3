const fs = require('fs')
const path = require('path')

const cssFilePath = path.join(
  __dirname,
  'node_modules',
  '@fortawesome',
  'fontawesome-free',
  'css',
  'all.css'
)

const iconRegex = /\.fa-(.*?)::before/g

const prefix = 'fa fa-solid'

fs.readFile(cssFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo CSS:', err)
    return
  }

  const icons = []
  let match
  while ((match = iconRegex.exec(data)) !== null) {
    icons.push(`${prefix} fa-${match[1]}`)
  }
})

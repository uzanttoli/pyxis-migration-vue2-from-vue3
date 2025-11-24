export class Tratamento {
  constructor(nome) {
    this.nome = nome
  }

  get myNameCompleted() {
    return this.nome
  }

  get myPrimaryName() {
    return this.nome.split(' ')[0].toLowerCase()
  }
}

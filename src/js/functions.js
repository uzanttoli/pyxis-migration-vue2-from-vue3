export class functions {
  retirarAcento(string) {
    if (!string) return
    const acentos = [
      'a',
      'á',
      'à',
      'ã',
      'â',
      'ä',
      'e',
      'é',
      'è',
      'ê',
      'ë',
      'i',
      'í',
      'ì',
      'î',
      'ï',
      'o',
      'ó',
      'ò',
      'õ',
      'ô',
      'ö',
      'u',
      'ú',
      'ù',
      'û',
      'ü',
      'c',
      'ç'
    ]
    const semAcento = [
      'a',
      'a',
      'a',
      'a',
      'a',
      'a',
      'e',
      'e',
      'e',
      'e',
      'e',
      'i',
      'i',
      'i',
      'i',
      'i',
      'o',
      'o',
      'o',
      'o',
      'o',
      'o',
      'u',
      'u',
      'u',
      'u',
      'u',
      'c',
      'c'
    ]

    for (let i = 0; i < acentos.length; i++) {
      const acento = new RegExp(acentos[i], 'g')
      string = string.replace(acento, semAcento[i])
    }
    return string
  }
  // retirarAcento(string) {
  //     if (!string) return;
  //     const acentos = ["ção"];
  //     const semAcento = ["cao"]

  //     for (let i = 0; i < acentos.length; i++) {
  //         const acento = new RegExp(acentos[i], "g");
  //         string = string.replace(acento, semAcento[i]);
  //     }
  //     return string;
  // }
}

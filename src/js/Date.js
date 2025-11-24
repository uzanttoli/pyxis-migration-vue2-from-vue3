function dateNowAmerican() {
  let date = new Date()

  let day = date.getDate().toString()
  let dayF = day.length == 1 ? '0' + day : day

  let month = (date.getMonth() + 1).toString()
  let monthF = month.length == 1 ? '0' + month : month

  let year = date.getFullYear().toString()

  return `${year}-${monthF}-${dayF}`
}

export default dateNowAmerican

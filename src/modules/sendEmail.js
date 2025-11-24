const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'cesantos@almavivadobrasil.com.br',
    pass: 'alm#2023'
  }
})

module.exports = transporter

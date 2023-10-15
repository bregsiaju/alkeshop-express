const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const ApiError = require('../app/utils/ApiError')

dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
})

const sendMail = (mail) => {
  const options = {
    from: '"Alkeshop" <no-reply@gmail.com>',
    to: mail.EMAIL,
    subject: mail.subject,
    text: mail.text,
    attachments: mail.attachments
  }

  transporter.sendMail(options, (err, info) => {
    if (err) throw new ApiError(400, 'Failed to send email')
    // console.log('pesan udh terkirim dong, cek emailnya')
  })
}

module.exports = sendMail

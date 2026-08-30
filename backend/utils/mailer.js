import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendContactNotification({ name, email, phone, message }) {
  await transporter.sendMail({
    from: `"Website Alumindo Jaya" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: `Pesan Baru dari Website - ${name}`,
    text: `Nama: ${name}\nEmail: ${email}\nTelepon: ${phone || '-'}\n\nPesan:\n${message}`,
    html: `
      <p><strong>Nama:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telepon:</strong> ${phone || '-'}</p>
      <p><strong>Pesan:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `,
  })
}

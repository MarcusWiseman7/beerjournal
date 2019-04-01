/* eslint-disable no-console */
const crypto = require('crypto')
const express = require('express')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')

// eslint-disable-next-line no-unused-vars
const { mongoose } = require('../db/mongoose')
const { User } = require('../models/user')

const router = express.Router()

// Nodemailer transport
const smtpTransport = nodemailer.createTransport({
  host: 'smtp.office365.com',
  auth: { user: 'no-reply@agileteams.io', pass: 'Fal32135' }
})

const verifyUserEmail = (params) => {
  const mailOptions = {
    to: params.email,
    from: '<no-reply@agileteams.io>',
    subject: 'BeerJournal Email Verification',
    text:
      `Hello ${params.name} ${params.surname}, \n\n` +
      `Please verify your email by following the link below: \n\n` +
      `https://${params.url}/auth/verify/${params.token} \n\n` +
      `If you didn't request to add your email to BeerJournal, please ignore this email and nothing will happen! \n\n` +
      `Best regards, \n\n` +
      `BeerJournal`
  }
  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) return { err: 412 }
  })

  return { status: 200 }
}

// Verify email
router.post('/verifyEmail', async (req, res) => {
  const id = req.body.id
  const email = req.body.email
  const token = crypto.randomBytes(20).toString('hex')

  const user = await User.findByIdAndUpdate(
    id,
    {
      $push: { verifyEmails: { email, token }, verifyEmailToken: token }
    },
    { new: true }
  )
  if (!user) return res.status(404).send()

  const info = await verifyUserEmail({
    url: req.headers.host,
    name: user.name,
    surname: user.surname,
    email,
    token
  })
  if (info.err) return res.status(info.err).send()

  res.status(200).send()
})

// Add verified email to user profile
router.patch('/addVerifiedEmail', async (req, res) => {
  const token = req.body.token

  try {
    const user = await User.findOne({ verifyEmailToken: token })
    if (!user) return res.status(404).send()

    const myObject = user.verifyEmails.find(x => x.token === token)
    // user.email.push(myObject.email)
    user.email = myObject.email
    user.verifyEmails.splice(user.verifyEmails.indexOf(myObject), 1)
    user.verifyEmailToken.splice(user.verifyEmailToken.indexOf(token), 1)

    await user.save((err) => {
      if (err) return res.status(400).send(err)
    })

    res.status(200).send()
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Change password
router.patch('/changePassword', async (req, res) => {
  try {
    const user = await User.findById(req.body.id)

    if (user && bcrypt.compareSync(req.body.currentPassword, user.password)) {
      user.password = req.body.newPassword

      await user.save((err) => {
        if (err) return res.status(400).send()
      })
      return res.status(200).send()
    }

    res.status(401).send()
  } catch (err) {
    res.status(400).send(err)
  }
})

// Forgot password email to reset
router.post('/forgot', async (req, res) => {
  const email = req.body.email
  const token = await crypto.randomBytes(20).toString('hex')

  const user = await User.findOne({ email: email })
  if (!user) return res.status(404).send()

  user.resetPasswordToken = token
  user.resetPasswordExpires = Date.now() + 3600000

  await user.save((err) => {
    if (err) return res.status(400).send()
  })

  const mailOptions = {
    to: email,
    from: 'Password Reset <no-reply@agileteams.io>',
    subject: 'BeerJournal Password Reset',
    text:
      `Hello ${user.name}, \n\n` +
      'You are receiving this email because you have requested to reset your BeerJournal password.\n\n' +
      'Please click on the following link, or paste it into your browser to complete the process:\n\n' +
      `https://${req.headers.host}/auth/reset/${token} \n\n` +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n\n' +
      'Best regards, \n\n' +
      'BeerJournal'
  }
  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) return res.status(412).send(err)
  })

  res.status(200).send()
})

// Reset forgotten password
router.post('/reset/:token', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (!user) return res.status(404).send()

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined

  await user.save((err) => {
    if (err) return res.status(400).send(err)
  })

  res.status(200).send()
})

// Check DB for email
router.get('/checkEmail/:email', async (req, res) => {
  const user = await User.findOne({ email: req.params.email })
  if (!user) return res.status(200).send({ emailUnique: true })
  return res.status(200).send({ emailUnique: false })
})

// Create new user
router.post('/:email', async (req, res) => {
  try {
    const token = await crypto.randomBytes(20).toString('hex')
    const email = req.params.email
    const user = await new User(req.body)

    user.dateCreated = new Date()
    user.verifyEmails.push({ email, token })
    user.verifyEmailToken.push(token)

    await user.save((err) => {
      if (err) return res.status(400).send(err)
    })

    const info = await verifyUserEmail({
      url: req.headers.host,
      name: user.name,
      surname: user.surname,
      email,
      token
    })
    if (info.err) return res.status(info.err).send()

    res.status(200).send()
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Retrieve user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('beers')
    if (!user) return res.status(404).send()

    res.status(200).send(user)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Update user
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        select: '-password -verifyEmailToken -dateCreated -__v -jwt -gdprApproval'
      }
    ).populate('beers')
    if (!user) return res.status(404).send()

    res.status(200).send(user)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id)
    if (!user) return res.status(404).send()

    res.status(200).send()
  } catch (err) {
    return res.status(400).send(err)
  }
})

module.exports = router

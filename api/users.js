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
  auth: { user: 'no-reply.beerjournal@outlook.com', pass: 'QhaB38OwEbSB2c5v' }
})

const verifyUserEmail = (params) => {
  const mailOptions = {
    to: params.email,
    from: '<no-reply.beerjournal@outlook.com>',
    subject: 'BeerJournal Email Verification',
    text:
      `Hello ${params.name} ${params.surname}, \n\n` +
      `Please verify your email by following the link below: \n\n` +
      `https://${params.url}/auth/verify/${params.email} \n\n` +
      `If you didn't request to add your email to BeerJournal, please ignore this email and nothing will happen! \n\n` +
      `Best regards, \n\n` +
      `BeerJournal`
  }
  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) return { err: 412 }
  })

  return { status: 200 }
}

// Add verified email to user profile
router.patch('/addVerifiedEmail', async (req, res) => {
  try {
    const email = req.body.email
    const user = await User.findOneAndUpdate(
      { verifyEmail: email },
      { $set: { email: email, verifyEmail: undefined } },
      { new: true }
    )
    if (!user) return res.status(404).send()

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
router.patch('/forgot', async (req, res) => {
  try {
    const email = req.body.email
    const resetPasswordToken = await crypto.randomBytes(20).toString('hex')
    const resetPasswordExpires = Date.now() + 3600000

    const user = await User.findOneAndUpdate(
      { email }, { $set: { resetPasswordToken, resetPasswordExpires } }, { new: true }
    )
    if (!user) return res.status(404).send()

    const mailOptions = {
      to: email,
      from: 'Password Reset <no-reply.beerjournal@outlook.com>',
      subject: 'BeerJournal Password Reset',
      text:
        `Hello ${user.name}, \n\n` +
        'You are receiving this email because you have requested to reset your BeerJournal password.\n\n' +
        'Please click on the following link, or paste it into your browser to complete the process:\n\n' +
        `https://${req.headers.host}/auth/reset/${resetPasswordToken} \n\n` +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n\n' +
        'Best regards, \n\n' +
        'BeerJournal'
    }
    smtpTransport.sendMail(mailOptions, (err) => {
      if (err) return res.status(412).send(err)
    })

    res.status(200).send()
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Reset forgotten password
router.patch('/reset/:token', async (req, res) => {
  try {
    const password = req.body.password
    const user = await User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      }
    )
    if (!user) return res.status(404).send()

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save((err) => {
      if (err) return res.status(400).send(err)
    })

    res.status(200).send()
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Create new user
router.post('/newUser', async (req, res) => {
  try {
    const email = req.body.email
    const name = req.body.name
    const surname = req.body.surname
    const password = req.body.password
    const gdprApproval = req.body.gdprApproval
    const url = req.headers.host

    const checkUserEmail = await User.findOne({ email })
    if (checkUserEmail) return res.status(404).send()

    const user = await new User({ name, surname, verifyEmail: email, password, gdprApproval })
    await user.save()

    const info = await verifyUserEmail({ url, name, surname, email })
    if (info.err) return res.status(info.err).send()

    return res.status(200).send()
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Retrieve user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('_id name surname email userIcon darkMode')
      .populate({
        path: 'reviews',
        select: '-__v dateCreated',
        populate: {
          path: 'beer',
          select: '_id beerName breweryId style degrees abv logo description averagePrice averageRating totalNumberOfRatings'
        }
      })
    if (!user) return res.status(404).send()

    res.status(200).send(user)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Update user
router.patch('/:id', async (req, res) => {
  try {
    const email = req.body.newEmail
    const name = req.body.name
    const surname = req.body.surname
    const userIcon = req.body.userIcon
    const darkMode = req.body.darkMode
    const body = { name, surname, userIcon, darkMode }

    if (email) {
      body.verifyEmail = email
      const checkUserEmail = await User.findOne({ email })
      if (checkUserEmail) return res.status(404).send()

      const info = await verifyUserEmail({ url: req.headers.host, name, surname, email })
      if (info.err) return res.status(info.err).send()
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, select: '_id name surname email userIcon darkMode' }
    )
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

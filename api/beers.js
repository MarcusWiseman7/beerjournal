/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const express = require('express')
const nodemailer = require('nodemailer')

// eslint-disable-next-line no-unused-vars
const { mongoose } = require('../db/mongoose')
const { Beer } = require('../models/beer')

const router = express.Router()

// Nodemailer transport
const smtpTransport = nodemailer.createTransport({
  host: 'smtp.office365.com',
  auth: { user: 'no-reply.beerjournal@outlook.com', pass: 'mmOUXH6lSwhTX0ZJ' }
})

// sort breweries
router.get('/sort', async (req, res) => {
  try {
    let list = await JSON.parse(fs.readFileSync(path.join(__dirname, '../data/sorted.json'), 'utf8'))

    list = await list.sort((a, b) => {
      return a.localeCompare(b)
    })
    await fs.writeFileSync(path.join(__dirname, '../data/breweries.json'), JSON.stringify(list), 'utf8')

    res.status(200).send()
  } catch {
    return res.status(400).send()
  }
})

// Create new beer
router.post('/', async (req, res) => {
  try {
    const beer = await new Beer(req.body)
    beer.save((err) => {
      if (err) return res.status(400).send(err)
    })

    if (beer.tempBeer) {
      const mailOptions = {
        to: 'marcus.wiseman@wisemanjech.com',
        from: '<no-reply.beerjournal@outlook.com>',
        subject: 'New Temp Beer',
        text:
          `Beer name: ${beer.beerName} \n\n` +
          `Brewery: ${beer.brewery} \n\n` +
          `Style: ${beer.style} \n\n` +
          `Degrees: ${beer.degrees} \n\n` +
          `Abv: ${beer.abv}` +
          `Beer ID: ${beer._id}`
      }
      smtpTransport.sendMail(mailOptions, (err) => {
        if (err) return { err: 412 }
      })
    }

    res.status(200).send(beer)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Retrieve all beers
router.get('/allBeers', async (req, res) => {
  try {
    const beers = await Beer.find({ tempBeer: false })
      .select('_id beerName brewery style degrees abv averagePrice averageRating')
    if (!beers) return res.status(404).send()

    res.status(200).send(beers)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Update beer
router.patch('/:id', async (req, res) => {
  try {
    const beer = await Beer.findByIdAndUpdate(
      req.params.id, { $set: req.body }, { new: true }
    )
    if (!beer) return res.status(404).send()

    res.status(200).send(beer)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Delete beer
router.delete('/:id', async (req, res) => {
  try {
    const beer = await Beer.findByIdAndRemove(req.params.id)
    if (!beer) return res.status(404).send()

    res.status(200).send()
  } catch (err) {
    return res.status(400).send(err)
  }
})

module.exports = router

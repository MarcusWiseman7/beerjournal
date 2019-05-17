/* eslint-disable no-console */
// const fs = require('fs')
// const path = require('path')
const express = require('express')
const nodemailer = require('nodemailer')

// eslint-disable-next-line no-unused-vars
const { mongoose } = require('../db/mongoose')
const { Beer } = require('../models/beer')
const { Brewery } = require('../models/brewery')

const router = express.Router()

// Nodemailer transport
const smtpTransport = nodemailer.createTransport({
  host: 'smtp.office365.com',
  auth: { user: 'no-reply.beerjournal@outlook.com', pass: 'HANrjyNiBfvHR7th' }
})

// sort breweries
// router.get('/sort', async (req, res) => {
//   try {
//     let list = await JSON.parse(fs.readFileSync(path.join(__dirname, '../data/sorted.json'), 'utf8'))

//     list = await list.sort((a, b) => {
//       return a.localeCompare(b)
//     })
//     await fs.writeFileSync(path.join(__dirname, '../data/breweries.json'), JSON.stringify(list), 'utf8')

//     res.status(200).send()
//   } catch {
//     return res.status(400).send()
//   }
// })

// Create new beer
router.post('/', async (req, res) => {
  try {
    const payload = Object.assign({}, req.body)
    let newBrewery
    // const checkBeer = await Beer.findOne({ beerName: payload.beerName, brewery: payload.brewery })
    // if (checkBeer) return res.status(404).send(checkBeer)
    if (payload.tempBrewery) {
      newBrewery = await new Brewery({ name: payload.brewery })
      await newBrewery.save((err) => {
        if (err) return res.status(400).send(err)
      })
      payload.brewery = newBrewery._id
    }

    const beer = await new Beer(payload)
    await beer.save((err) => {
      if (err) return res.status(400).send(err)
    })

    if (beer.tempBrewery) {
      beer.brewery = newBrewery
    } else {
      const brewery = await Brewery.findById(beer.brewery)
      if (!brewery) return res.status(404).send()
      beer.brewery = brewery
    }

    if (beer.tempBeer) {
      const mailOptions = {
        to: 'marcus.wiseman@wisemanjech.com',
        from: '<no-reply.beerjournal@outlook.com>',
        subject: 'New Temp Beer',
        text:
          `Beer name: ${beer.beerName} \n\n` +
          `Style: ${beer.style} \n\n` +
          `Degrees: ${beer.degrees} \n\n` +
          `Abv: ${beer.abv} \n\n` +
          `Beer ID: ${beer._id} \n\n` +
          `Brewery: ${beer.brewery.name} \n\n` +
          `Brewery ID: ${beer.brewery._id} \n\n` +
          `Temp Brewery: ${beer.tempBrewery}`
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

// Retrieve temp beers
router.get('/tempBeers', async (req, res) => {
  try {
    const tempBeers = await Beer.find({ tempBeer: true })
      .select('_id beerName brewery style degrees abv logo tempBeer description')
      .populate('brewery')
    if (!tempBeers) return res.status(404).send()

    res.status(200).send(tempBeers)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Retrieve all beers & breweries
router.get('/allBeers', async (req, res) => {
  try {
    const beers = await Beer.find({ tempBeer: false })
      .select('_id beerName brewery style degrees abv logo description averagePrice averageRating totalNumberOfRatings')
      .populate('brewery')
    const breweries = await Brewery.find()
      .select('-__v -sumOfAllBeerRatings')
    if (!beers || !breweries) return res.status(404).send()

    res.status(200).send({ beers, breweries })
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

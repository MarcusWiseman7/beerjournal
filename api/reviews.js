const express = require('express')

// eslint-disable-next-line no-unused-vars
const { mongoose } = require('../db/mongoose')
const { Review } = require('../models/review')
const { Beer } = require('../models/beer')

const router = express.Router()

// Create new review
router.post('/', async (req, res) => {
  try {
    const review = await new Review(req.body).save((err) => {
      if (err) return res.status(400).send(err)
    })
    const beer = await Beer.findById(review.beer)
    if (!beer) return res.status(404).send()

    beer.sumOfAllRatings = +beer.sumOfAllRatings + +review.rating
    beer.totalNumberOfRatings = +beer.totalNumberOfRatings + 1
    beer.averageRating = Math.round(+beer.sumOfAllRatings / +beer.totalNumberOfRatings)
    if (review.price) {
      beer.sumOfAllPrices = +beer.sumOfAllPrices + +review.price
      beer.totalNumberOfPrices = +beer.totalNumberOfPrices + 1
      beer.averagePrice = Math.round(+beer.sumOfAllPrices / +beer.totalNumberOfPrices)
    }

    await beer.save((err) => {
      if (err) return res.status(400).send(err)
    })

    res.status(200).send({ review, beer })
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Retrieve review
router.post('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('beer')
    if (!review) return res.status(404).send()

    res.status(200).send(review)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Update review
router.post('/:id', async (req, res) => {
  try {
    const beerId = req.body.beer
    const rating = req.body.rating
    const previousRating = req.body.previousRating
    const price = req.body.price
    const previousPrice = req.body.previousPrice
    const location = req.body.location
    const notes = req.body.notes

    if (rating || price) {
      const beer = await Beer.findById(beerId)
      if (!beer) return res.status(404).send()

      if (rating) {
        beer.sumOfAllRatings = +beer.sumOfAllRatings - +previousRating + +rating
        beer.averageRating = Math.round(+beer.sumOfAllRatings / +beer.totalNumberOfRatings)
      } else if (price) {
        if (previousPrice) {
          beer.sumOfAllPrices = +beer.sumOfAllPrices - +previousPrice + +price
        } else {
          beer.sumOfAllPrices = +beer.sumOfAllPrices + +price
          beer.totalNumberOfPrices = +beer.totalNumberOfPrices + 1
        }
        beer.averagePrice = Math.round(+beer.sumOfAllPrices / +beer.totalNumberOfPrices)
      }

      await beer.save((err) => {
        if (err) return res.status(400).send(err)
      })
    }
    const review = await Review.findByIdAndUpdate(
      req.params.id, { $set: { price, location, rating, notes } }, { new: true }
    ).populate('beer')
    if (!review) return res.status(404).send()

    res.status(200).send(review)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndRemove(req.params.id)
    if (!review) return res.status(404).send()

    res.status(200).send()
  } catch (err) {
    return res.status(400).send(err)
  }
})

module.exports = router

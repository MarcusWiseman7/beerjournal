const express = require('express')

// eslint-disable-next-line no-unused-vars
const { mongoose } = require('../db/mongoose')
const { Review } = require('../models/review')
const { Beer } = require('../models/beer')
const { User } = require('../models/user')

const router = express.Router()

const populateParams = {
  path: 'reviews',
  select: '-__v -dateCreated',
  populate: {
    path: 'beer',
    select: '_id beerName brewery style degrees abv description averagePrice averageRating totalNumberOfRatings'
  }
}
const averageRound = (a, b, c) => {
  const x = Math.pow(10, c || 0)
  return Math.round(a / b * x) / x
}

// Create new review
router.post('/:userId', async (req, res) => {
  try {
    const id = req.params.id
    const review = await new Review(req.body)
    await review.save((err) => {
      if (err) return res.status(400).send(err)
    })

    const beer = await Beer.findById(review.beer)
    if (!beer) return res.status(404).send()

    beer.sumOfAllRatings = +beer.sumOfAllRatings + +review.rating
    beer.totalNumberOfRatings = +beer.totalNumberOfRatings + 1
    beer.averageRating = averageRound(+beer.sumOfAllRatings, +beer.totalNumberOfRatings, 1)
    if (review.price) {
      beer.sumOfAllPrices = +beer.sumOfAllPrices + +review.price
      beer.totalNumberOfPrices = +beer.totalNumberOfPrices + 1
      beer.averagePrice = averageRound(+beer.sumOfAllPrices, +beer.totalNumberOfPrices, 0)
    }

    await beer.save((err) => {
      if (err) return res.status(400).send(err)
    })

    const user = await User.findByIdAndUpdate(id, { $push: { reviews: review._id } }, { new: true })
      .populate(populateParams)
    if (!user) return res.status(404).send()

    res.status(200).send(user)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Retrieve all reviews for a beer
router.get('/:beerId', async (req, res) => {
  try {
    const reviews = await Review.find({ beer: req.params.beerId })
      .populate({
        path: 'reviewer',
        select: 'name'
      })
    if (!reviews) return res.status(404).send()

    res.status(200).send(reviews)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Update review
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.body.reviewer
    const beerId = req.body.beer
    const rating = req.body.rating
    const price = req.body.price
    const location = req.body.location
    const notes = req.body.notes

    const review = await Review.findByIdAndUpdate(
      req.params.id, { $set: { price, location, rating, notes } }, { new: false }
    )
    if (!review) return res.status(404).send()

    if (rating || price) {
      const beer = await Beer.findById(beerId)
      if (!beer) return res.status(404).send()

      if (rating) {
        beer.sumOfAllRatings = +beer.sumOfAllRatings - +review.rating + +rating
        beer.averageRating = averageRound(+beer.sumOfAllRatings, +beer.totalNumberOfRatings, 1)
      } else if (price) {
        if (review.price) {
          beer.sumOfAllPrices = +beer.sumOfAllPrices - +review.price + +price
        } else {
          beer.sumOfAllPrices = +beer.sumOfAllPrices + +price
          beer.totalNumberOfPrices = +beer.totalNumberOfPrices + 1
        }
        beer.averagePrice = averageRound(+beer.sumOfAllPrices, +beer.totalNumberOfPrices, 0)
      }

      await beer.save((err) => {
        if (err) return res.status(400).send(err)
      })
    }

    const user = await User.findById(userId)
      .populate(populateParams)
    if (!user) return res.status(404).send()

    res.status(200).send(user)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Delete review
router.delete('/:id/:userId', async (req, res) => {
  try {
    const reviewId = req.params.id
    const review = await Review.findByIdAndRemove(reviewId)
    if (!review) return res.status(404).send()

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { reviews: reviewId } },
      { new: true }
    )
      .populate(populateParams)
    if (!user) return res.status(404).send()

    res.status(200).send(user)
  } catch (err) {
    return res.status(400).send(err)
  }
})

module.exports = router

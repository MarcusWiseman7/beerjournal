const express = require('express')

// eslint-disable-next-line no-unused-vars
const { mongoose } = require('../db/mongoose')
const { Beer } = require('../models/beer')

const router = express.Router()

// Create new beer
router.post('/', async (req, res) => {
  try {
    await new Beer(req.body)

    res.status(200).send()
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Retrieve beer
router.post('/:id', async (req, res) => {
  try {
    const beer = await Beer.findById(req.params.id)
    if (!beer) return res.status(404).send()

    res.status(200).send(beer)
  } catch (err) {
    return res.status(400).send(err)
  }
})

// Update beer
router.post('/:id', async (req, res) => {
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

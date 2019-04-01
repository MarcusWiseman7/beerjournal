const mongoose = require('mongoose')

const beerSchema = new mongoose.Schema({
  beerName: { type: String, trim: true },
  brewery: { type: String, trim: true },
  style: { type: String, trim: true },
  degrees: { type: Number },
  abv: { type: Number },
  totalRatingsAdded: { type: Number },
  totalNumberOfRatings: { type: Number },
  averageRating: { type: Number },
  totalPricesAdded: { type: Number },
  totalNumberOfPrices: { type: Number },
  averagePrice: { type: Number }
}, { usePushEach: true })

const Beer = mongoose.model('Beer', beerSchema)

module.exports = { Beer }

const mongoose = require('mongoose')

const beerSchema = new mongoose.Schema({
  dateCreated: { type: Date, default: Date.now },
  beerName: { type: String, required: true, trim: true },
  breweryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brewery' },
  style: { type: String, required: true, trim: true },
  degrees: { type: Number },
  abv: { type: Number },
  logo: { type: String, trim: true },
  description: { type: String, trim: true },
  tempBeer: { type: Boolean, default: false },
  tempBrewery: { type: String, trim: true },
  sumOfAllRatings: { type: Number, default: 0 },
  totalNumberOfRatings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  highestAverageRatingLocation: { type: String },
  sumOfAllPrices: { type: Number, default: 0 },
  totalNumberOfPrices: { type: Number, default: 0 },
  averagePrice: { type: Number, default: 0 },
  lowestPriceLocation: { type: String }
}, { usePushEach: true })

const Beer = mongoose.model('Beer', beerSchema)

module.exports = { Beer }

const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  price: { type: Number },
  location: { type: String, trim: true },
  rating: { type: Number },
  notes: { type: String, trim: true },
  beerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }
}, { usePushEach: true })

const Review = mongoose.model('Review', reviewSchema)

module.exports = { Review }

const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  price: { type: Number },
  location: { type: String, trim: true },
  rating: { type: Number, required: true },
  notes: { type: String, trim: true },
  dateCreated: { type: Date, default: Date.now },
  beer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Beer' }
}, { usePushEach: true })

const Review = mongoose.model('Review', reviewSchema)

module.exports = { Review }

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const options = { usePushEach: true, discriminatorKey: 'role' }

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    userIcon: { type: String, default: 'fa fa-user-astronaut' },
    password: { type: String, required: true, trim: true },
    email: { type: String, trim: true, unique: true },
    gdprApproval: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    verifyEmail: { type: String, trim: true },
    jwt: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  options
)

UserSchema.pre('save', function (next) {
  const user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err)
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = { User }

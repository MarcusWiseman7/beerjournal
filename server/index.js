const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const auth = require('../api/auth')
const users = require('../api/users')
const beers = require('../api/beers')
const reviews = require('../api/reviews')
const breweries = require('../api/breweries')

const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // App middleware
  app.use(compression())
  app.use(helmet())
  app.use(cors())
  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Api routes
  app.use('/auth', auth)
  app.use('/users', users)
  app.use('/beers', beers)
  app.use('/reviews', reviews)
  app.use('/breweries', breweries)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()

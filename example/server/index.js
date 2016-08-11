/* eslint-disable global-require, no-console */

const path = require('path')
const Express = require('express')
const app = new Express()
const port = 3000

if (process.env.NODE_ENV === 'development') {
  require('./middlewares/dev.middleware')(app)
} else if (process.env.NODE_ENV === 'production') {
  app.use('/static', Express.static(path.join(__dirname, '..', 'static')))
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'))
})

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
  }
})

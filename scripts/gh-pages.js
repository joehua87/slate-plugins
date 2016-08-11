const ghpages = require('gh-pages')
const path = require('path')

const options = {
  src: [
    'static/*',
    'index.html',
  ]
}

// TODO Make sure staic is built (should be use gulp)
ghpages.publish(path.join(__dirname, '..', 'example'), options, (err) => {
  console.log(err)
})

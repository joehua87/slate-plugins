const ghpages = require('gh-pages')
const path = require('path')

const options = {
  src: [
    'static/*',
    'index.html',
    'slate.css',
  ]
}

// TODO Make sure staic is built (should be use gulp)
ghpages.publish(path.join(__dirname, '..', 'example'), options, (err) => {
  if (err) console.log(err)
  else console.log('Publish to github pages successfully!')
})

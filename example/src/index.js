import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
// import { whyDidYouUpdate } from 'why-did-you-update'
import App from './containers/App'
// import configureStore from './redux/configureStore.dev'
// const store = configureStore()

/*
if (process.env.NODE_ENV !== 'production') {
  whyDidYouUpdate(React, { exclude: [/^DockMonitor/, /^Connect/] })
}
*/

render(
  // <Root store={store} />,
  <App />,
  document.getElementById('root')
)

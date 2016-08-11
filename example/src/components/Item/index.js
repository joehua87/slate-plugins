import React from 'react'
import styles from './styles.css'

export default class Item extends React.Component { // eslint-disable-line
  render() {
    return (
      <div className={styles.root}>
        Item
      </div>
    )
  }
}

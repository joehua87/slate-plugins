import React from 'react'
import { render, shallow } from 'enzyme'
import Item from '../index'

describe('Item', () => {
  it('render using shallow', () => {
    const result = shallow(<Item />)
    console.log(result.debug())
  })

  it('Render with render', () => {
    const result = render(<Item />)
    console.log(result.html())
  })
})

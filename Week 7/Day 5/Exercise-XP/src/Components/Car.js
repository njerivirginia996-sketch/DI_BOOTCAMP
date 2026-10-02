import { createElement, useState } from 'react'
import Garage from './Garage.jsx'

function Car({ carInfo }) {
  const [color] = useState('red')

  return createElement(
    'div',
    { className: 'component-output' },
    createElement(
      'h3',
      null,
      'This car is ',
      createElement('strong', null, `${color} ${carInfo.model}`),
      '.',
    ),
    createElement(Garage, { size: 'small' }),
  )
}

export default Car
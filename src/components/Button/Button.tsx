import React, { CSSProperties } from 'react'
import './Button.scss'
import { ButtonProps, Color } from './Button.types'

import { createNamespace } from '@/utils/bem'

const btn = createNamespace('button')

const Button: React.FC<ButtonProps> = ({ color = Color.black, text = '按钮', tip = 'haha' }) => {
  const btnStyle: CSSProperties = {
    background: 'black'
  }

  return (
    <button className='button' style={btnStyle} title={tip}>
      {text}
    </button>
  )
}

export default Button

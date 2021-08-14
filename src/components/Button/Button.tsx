import React, { CSSProperties } from 'react'
import './button.scss'

import { createNamespace } from '../../utils/bem'

enum Color {
  Black = '#2d2b34',
  White = '#d8d7d7',
  Yellow = '#fed765',
  Orange = '#eb6e3d'
}

export interface ButtonProps {
  color?: Color
  text?: string
}

const btn = createNamespace('button')

console.log({ btn })

const Button: React.FC<ButtonProps> = ({ color = Color.Black, text = '按钮' }) => {
  const btnStyle: CSSProperties = {
    background: color
  }

  return (
    <button className='button' style={btnStyle}>
      {text}
    </button>
  )
}

export default Button

export const enum Color {
  black = '#2d2b34',
  white = '#d8d7d7',
  yellow = '#fed765',
  orange = '#eb6e3d'
}

type ColorType = keyof Record<Color, string>

export interface ButtonProps {
  color: string
  text?: string
  tip: string
}

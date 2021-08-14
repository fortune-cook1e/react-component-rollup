export type Mod = string | { [key: string]: any }
export type Mods = Mod | Mod[]

function gen(name: string, mods?: Mods): string {
  if (!mods) {
    return ''
  }

  if (typeof mods === 'string') {
    return ` ${name}--${mods}`
  }

  if (Array.isArray(mods)) {
    return mods.reduce<string>((ret, item) => ret + gen(name, item), '')
  }

  return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? gen(name, key) : ''), '')
}

export function createBEM(name: string) {
  return function (el?: Mods, mods?: Mods): Mods {
    if (el && typeof el !== 'string') {
      mods = el
      el = ''
    }

    el = el ? `${name}__${el}` : name

    return `${el}${gen(el, mods)}`
  }
}

export function createNamespace(name: string) {
  const prefixedName = `cookie-${name}`
  return [prefixedName, createBEM(prefixedName)] as const
}

export type BEM = ReturnType<typeof createBEM>

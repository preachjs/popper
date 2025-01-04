declare module '@preachjs/popper/arrow' {
  import type { Plugin } from '@preachjs/popper/index.js/index'
  export const arrow: (arrowEl: HTMLElement) => Plugin
}
declare module '@preachjs/popper/index' {
  export function createPopper(anchor: HTMLElement, target: HTMLElement): Popper
  export type PluginOptions = {
    position: Position
    alignment: Alignment
  }
  export type Plugin = (
    anchor: HTMLElement,
    target: HTMLElement,
    options: PluginOptions
  ) => void
  type Position = 'top' | 'left' | 'right' | 'bottom'
  type Alignment = 'center' | 'start' | 'end'
  class Popper {
    anchor: HTMLElement
    target: HTMLElement
    _position: Position
    _alignment: Alignment
    _offset: number
    _plugins: Plugin[]
    constructor(anchor: HTMLElement, target: HTMLElement)
    use(plug: Plugin): void
    move(position?: Position, alignment?: Alignment): this
    offset(num: number): this
    align(): void
  }
  export {}
}
declare module '@preachjs/popper' {
  import main = require('@preachjs/popper/src/index')
  export = main
}

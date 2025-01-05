export type Position = 'top' | 'left' | 'right' | 'bottom'
export type Alignment = 'center' | 'start' | 'end'

export type ElementPosition = {
  top: number
  left: number
  height: number
  width: number
} & Record<string, unknown>

export type PluginOptions = {
  position: Position
  alignment: Alignment
}

export type Plugin = {
  setup?: (popper: Popper, anchor: HTMLElement, target: HTMLElement) => void
  onAlign?: (
    anchor: ElementPosition,
    target: ElementPosition,
    options: PluginOptions,
    popper: Popper
  ) => {
    anchor: ElementPosition
    target: ElementPosition
  }
  onAlignEnd?: () => void
}

export interface Popper {
  use(plug: Plugin): void
  move(position?: Position, alignment?: Alignment): Popper
  decorate(name: string, fn: (...args: any[]) => void): Popper
  offset(num: number): Popper
  align(): void
}

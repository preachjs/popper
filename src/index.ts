export function createPopper(anchor: HTMLElement, target: HTMLElement) {
  return new Popper(anchor, target)
}

export type PluginOptions = {
  position: Position
  alignment: Alignment
}

export type ElementPosition = {
  top: number
  left: number
  height: number
  width: number
} & Record<string, unknown>

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

type Position = 'top' | 'left' | 'right' | 'bottom'
type Alignment = 'center' | 'start' | 'end'

export class Popper {
  anchor: HTMLElement
  target: HTMLElement
  _position: Position = 'bottom'
  _alignment: Alignment = 'center'
  _offset: number = 0
  _plugins: Plugin[] = []

  constructor(anchor: HTMLElement, target: HTMLElement) {
    this.anchor = anchor
    this.target = target
  }

  use(plug: Plugin) {
    this._plugins.push(plug)
    plug.setup?.(this, this.anchor, this.target)
  }

  move(position: Position = 'bottom', alignment: Alignment = 'center') {
    this._position = position
    this._alignment = alignment
    return this
  }

  decorate(name: string, fn: (...args: unknown[]) => void) {
    if (Object.prototype.hasOwnProperty.call(this, name)) {
      console.warn(`tried to define ${name} again`)
      return
    }
    Object.defineProperty(this, name, {
      value: fn,
    })
  }

  offset(num: number) {
    this._offset = num
    return this
  }

  align() {
    const anchorBox = this.anchor.getBoundingClientRect()
    const targetBox = this.target.getBoundingClientRect()
    this.target.style.position = 'absolute'
    const targetPosition = _computeTargetPosition(
      {
        left: anchorBox.left,
        top: anchorBox.top,
        height: anchorBox.height,
        width: anchorBox.width,
      },
      {
        left: targetBox.left,
        top: targetBox.top,
        height: targetBox.height,
        width: targetBox.width,
      },
      this._alignment,
      this._position,
      this._offset
    )
    const finalPosition = this._plugins.reduce(
      (acc, plugin) =>
        !plugin.onAlign
          ? acc
          : plugin.onAlign(
              acc.anchor,
              acc.target,
              {
                alignment: this._alignment,
                position: this._position,
              },
              this
            ),
      {
        anchor: {
          left: anchorBox.left,
          top: anchorBox.top,
          height: anchorBox.height,
          width: anchorBox.width,
        },
        target: targetPosition,
      }
    )
    this.target.style.top = finalPosition.target.top + 'px'
    this.target.style.left = finalPosition.target.left + 'px'
    this._plugins.forEach(d => d.onAlignEnd?.())
  }
}

function _computeTargetPosition(
  anchorBox: ElementPosition,
  targetBox: ElementPosition,
  align: Alignment,
  position: Position,
  offset: number = 0
) {
  const targetPosition: ElementPosition = {
    top: targetBox.top,
    left: targetBox.left,
    height: targetBox.height,
    width: targetBox.width,
  }

  switch (position) {
    case 'top': {
      targetPosition.top = anchorBox.top - targetBox.height - offset
      break
    }
    case 'bottom': {
      targetPosition.top = anchorBox.top + anchorBox.height + offset
      break
    }
    case 'left': {
      targetPosition.left = anchorBox.left - targetBox.width - offset
      break
    }
    case 'right': {
      targetPosition.left = anchorBox.left + anchorBox.width + offset
      break
    }
  }

  switch (align) {
    case 'start': {
      if (position === 'top' || position === 'bottom') {
        targetPosition.left = anchorBox.left
      }
      if (position === 'left' || position === 'right') {
        targetPosition.top = anchorBox.top
      }
      break
    }
    case 'center': {
      if (position === 'top' || position === 'bottom') {
        targetPosition.left =
          anchorBox.left - (targetBox.width / 2 - anchorBox.width / 2)
      }
      if (position === 'left' || position === 'right') {
        targetPosition.top =
          anchorBox.top + (anchorBox.height / 2 - targetBox.height / 2)
      }
      break
    }
    case 'end': {
      if (position === 'top' || position === 'bottom') {
        targetPosition.left = anchorBox.left + anchorBox.width - targetBox.width
      }
      if (position === 'left' || position === 'right') {
        targetPosition.top =
          anchorBox.top + (anchorBox.height - targetBox.height)
      }
      break
    }
  }

  return targetPosition
}

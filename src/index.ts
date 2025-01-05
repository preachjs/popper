import type {
  Alignment,
  ElementPosition,
  Plugin,
  Popper,
  Position,
} from './types'

export type * from './types'

import { boxToElementPosition } from './lib/boxToElementPosition.js'

export function createPopper(anchor: HTMLElement, target: HTMLElement) {
  return new _Popper(anchor, target) as unknown as Popper
}

// @ts-expect-error plugins are in the same folder
// that'll cause method missing errors even when plugins
// aren't imported
class _Popper implements Popper {
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
    plug.setup?.(this as unknown as Popper, this.anchor, this.target)
  }

  move(position: Position = 'bottom', alignment: Alignment = 'center') {
    this._position = position
    this._alignment = alignment
    return this as unknown as Popper
  }

  decorate(name: string, fn: (...args: any[]) => void) {
    if (Object.prototype.hasOwnProperty.call(this, name)) {
      console.warn(`tried to define ${name} again`)
      return this as unknown as Popper
    }
    Object.defineProperty(this, name, {
      value: fn,
    })
    return this as unknown as Popper
  }

  offset(num: number) {
    this._offset = num
    return this as unknown as Popper
  }

  align() {
    const anchorBox = this.anchor.getBoundingClientRect()
    const targetBox = this.target.getBoundingClientRect()
    const anchorElmPosition = boxToElementPosition(anchorBox)

    this.target.style.position = 'absolute'
    const targetPosition = _computeTargetPosition(
      anchorElmPosition,
      boxToElementPosition(targetBox),
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
              this as unknown as Popper
            ),
      {
        anchor: anchorElmPosition,
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

export function createPopper(anchor: HTMLElement, target: HTMLElement) {
  return new Popper(anchor, target)
}

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
  }

  move(position: Position = 'bottom', alignment: Alignment = 'center') {
    this._position = position
    this._alignment = alignment
    return this
  }

  offset(num: number) {
    this._offset = num
    return this
  }

  align() {
    this.target.style.position = 'absolute'
    _alignElement(
      this.anchor,
      this.target,
      this._alignment,
      this._position,
      this._offset
    )
    this._plugins.forEach(d =>
      d(this.anchor, this.target, {
        position: this._position,
        alignment: this._alignment,
      })
    )
  }
}

function _alignElement(
  anchor: HTMLElement,
  target: HTMLElement,
  align: Alignment,
  position: Position,
  offset: number = 0
) {
  const box = anchor.getBoundingClientRect()
  const targetBox = target.getBoundingClientRect()

  switch (position) {
    case 'top': {
      target.style.top = anchor.offsetTop - targetBox.height - offset + 'px'
      break
    }
    case 'bottom': {
      target.style.top = anchor.offsetTop + box.height + offset + 'px'
      break
    }
    case 'left': {
      target.style.left = box.x - targetBox.width - offset + 'px'
      break
    }
    case 'right': {
      target.style.left = box.x + box.width + offset + 'px'
      break
    }
  }

  switch (align) {
    case 'start': {
      if (position === 'top' || position === 'bottom') {
        target.style.left = anchor.offsetLeft + 'px'
      }
      if (position === 'left' || position === 'right') {
        target.style.top = anchor.offsetTop + 'px'
      }
      break
    }
    case 'center': {
      if (position === 'top' || position === 'bottom') {
        target.style.left =
          anchor.offsetLeft - (targetBox.width / 2 - box.width / 2) + 'px'
      }
      if (position === 'left' || position === 'right') {
        target.style.top =
          anchor.offsetTop + (box.height / 2 - targetBox.height / 2) + 'px'
      }
      break
    }
    case 'end': {
      if (position === 'top' || position === 'bottom') {
        target.style.left =
          anchor.offsetLeft + box.width - targetBox.width + 'px'
      }
      if (position === 'left' || position === 'right') {
        target.style.top =
          anchor.offsetTop + (box.height - targetBox.height) + 'px'
      }
      break
    }
  }
}

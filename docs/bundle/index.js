// src/index.ts
function createPopper(anchor, target) {
  return new Popper(anchor, target)
}
var Popper = class {
  anchor
  target
  _position = 'bottom'
  _alignment = 'center'
  _offset = 0
  _plugins = []
  constructor(anchor, target) {
    this.anchor = anchor
    this.target = target
  }
  use(plug) {
    this._plugins.push(plug)
  }
  move(position = 'bottom', alignment = 'center') {
    this._position = position
    this._alignment = alignment
    return this
  }
  offset(num) {
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
function _alignElement(anchor, target, align, position, offset = 0) {
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
export { createPopper }

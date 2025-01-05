import type { ElementPosition } from '../types'

export const boxToElementPosition = (box: DOMRect): ElementPosition => {
  return {
    left: box.left,
    top: box.top,
    height: box.height,
    width: box.width,
  }
}

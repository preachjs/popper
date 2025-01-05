import type { ElementPosition, Plugin, PluginOptions } from './index.js'

declare module '@preachjs/popper' {
  interface Popper {
    // toggle arrow appearance
    toggleArrow(bool: boolean): void
  }
}

export const arrow = (arrowEl?: HTMLElement): Plugin => {
  let visible = 1
  let finalPosition: ElementPosition
  return {
    setup(popper, anchor, target) {
      popper.decorate('toggleArrow', (bool: boolean) => {
        if (bool) {
          // reverse of the original logic allow the below
          // to automatically update the needed variables
          visible = bool ? 0 : 1
        }
        if (visible) {
          visible = 0
          delete arrowEl.dataset.popperArrowVisible
        } else {
          visible = 1
          arrowEl.dataset.popperArrowVisible = String(1)
        }
      })
    },
    onAlign(anchor, target, config) {
      finalPosition = undefined
      if (!visible) return { anchor, target }
      const {
        arrow: arrowPosition,
        target: targetPosition,
        anchor: anchorPosition,
      } = computeWithArrowPositions(anchor, target, arrowEl, config)
      finalPosition = arrowPosition
      return { target: targetPosition, anchor: anchorPosition }
    },
    onAlignEnd() {
      console.log({ finalPosition })
      if (!finalPosition) return
      arrowEl.style.position = 'absolute'
      arrowEl.style.transform = finalPosition.transform as string
      arrowEl.style.top = finalPosition.top + 'px'
      arrowEl.style.left = finalPosition.left + 'px'
    },
  }
}

function computeWithArrowPositions(
  anchorBox: ElementPosition,
  targetBox: ElementPosition,
  arrowEl: HTMLElement,
  config: PluginOptions
) {
  const arrowBox = arrowEl.getBoundingClientRect()

  const targetPosition = {
    ...targetBox,
  }
  const arrowPosition: ElementPosition = {
    ...arrowBox,
  }

  switch (config.position) {
    case 'top': {
      targetPosition.top = targetPosition.top - arrowBox.height
      arrowPosition.top = targetPosition.top + targetBox.height
      arrowPosition.transform = 'rotate(180deg)'
      break
    }
    case 'bottom': {
      targetPosition.top = targetPosition.top + arrowBox.height
      arrowPosition.top = targetPosition.top - arrowBox.height
      arrowPosition.transform = 'rotate(0deg)'
      break
    }
    case 'left': {
      targetPosition.left = targetPosition.left - arrowBox.width
      arrowPosition.left = targetPosition.left + targetBox.width
      arrowPosition.transform = 'rotate(90deg)'
      break
    }
    case 'right': {
      targetPosition.left = targetPosition.left + arrowBox.width
      arrowPosition.left = targetPosition.left - arrowBox.width
      arrowPosition.transform = 'rotate(270deg)'
      break
    }
  }

  switch (config.alignment) {
    case 'start': {
      if (config.position === 'top' || config.position === 'bottom') {
        arrowPosition.left = targetPosition.left
      }
      if (config.position === 'left' || config.position === 'right') {
        arrowPosition.top = targetBox.top
      }
      break
    }
    case 'center': {
      if (config.position === 'top' || config.position === 'bottom') {
        arrowPosition.left =
          anchorBox.left + (anchorBox.width / 2 - arrowBox.width / 2)
      }
      if (config.position === 'left' || config.position === 'right') {
        arrowPosition.top =
          anchorBox.top + (anchorBox.height / 2 - arrowBox.height / 2)
      }
      break
    }
    case 'end': {
      if (config.position === 'top' || config.position === 'bottom') {
        arrowPosition.left =
          targetPosition.left + targetBox.width - arrowBox.width
      }
      if (config.position === 'left' || config.position === 'right') {
        arrowPosition.top = anchorBox.top + (anchorBox.height - arrowBox.height)
      }
      break
    }
  }
  return { arrow: arrowPosition, anchor: anchorBox, target: targetPosition }
}

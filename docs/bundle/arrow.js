// src/arrow.ts
var arrow = arrowEl => {
  return (anchor, target, config) => {
    if (!arrowEl) {
      target.parentNode?.childNodes.forEach(d => {
        if (
          d.ELEMENT_NODE &&
          d instanceof HTMLElement &&
          d.classList.contains('popper-arrow')
        ) {
          arrowEl = d
        }
      })
      if (!arrowEl) {
        const arrow2 = document.createElement('span')
        arrow2.classList.add('popper-arrow')
        target.parentNode?.appendChild(arrow2)
        arrowEl = arrow2
      }
    } else {
      if (
        arrowEl.children[0].ELEMENT_NODE &&
        arrowEl.children[0].nodeName === 'TEMPLATE' &&
        'content' in arrowEl.children[0]
      ) {
        arrowEl.appendChild(arrowEl.children[0].content)
      }
    }
    alignArrow(anchor, arrowEl, target, config)
  }
}
function alignArrow(anchor, arrowEl, target, config) {
  const anchorBox = anchor.getBoundingClientRect()
  const arrowBox = arrowEl.getBoundingClientRect()
  const targetBox = target.getBoundingClientRect()
  arrowEl.style.position = 'absolute'
  switch (config.position) {
    case 'top': {
      target.style.top = target.offsetTop - arrowBox.height + 'px'
      arrowEl.style.top = target.offsetTop + targetBox.height + 'px'
      arrowEl.style.transform = 'rotate(180deg)'
      break
    }
    case 'bottom': {
      target.style.top = target.offsetTop + arrowBox.height + 'px'
      arrowEl.style.top = target.offsetTop - arrowBox.height + 'px'
      arrowEl.style.transform = 'rotate(0deg)'
      break
    }
    case 'left': {
      target.style.left = target.offsetLeft - arrowBox.width + 'px'
      arrowEl.style.left = target.offsetLeft + targetBox.width + 'px'
      arrowEl.style.transform = 'rotate(90deg)'
      break
    }
    case 'right': {
      target.style.left = target.offsetLeft + arrowBox.width + 'px'
      arrowEl.style.left = target.offsetLeft - arrowBox.width + 'px'
      arrowEl.style.transform = 'rotate(270deg)'
      break
    }
  }
  switch (config.alignment) {
    case 'start': {
      if (config.position === 'top' || config.position === 'bottom') {
        arrowEl.style.left = target.offsetLeft + 'px'
      }
      if (config.position === 'left' || config.position === 'right') {
        arrowEl.style.top = target.offsetTop + 'px'
      }
      break
    }
    case 'center': {
      if (config.position === 'top' || config.position === 'bottom') {
        arrowEl.style.left =
          anchor.offsetLeft + (anchorBox.width / 2 - arrowBox.width / 2) + 'px'
      }
      if (config.position === 'left' || config.position === 'right') {
        arrowEl.style.top =
          anchor.offsetTop + (anchorBox.height / 2 - arrowBox.height / 2) + 'px'
      }
      break
    }
    case 'end': {
      if (config.position === 'top' || config.position === 'bottom') {
        arrowEl.style.left =
          target.offsetLeft + targetBox.width - arrowBox.width + 'px'
      }
      if (config.position === 'left' || config.position === 'right') {
        arrowEl.style.top =
          anchor.offsetTop + (anchorBox.height - arrowBox.height) + 'px'
      }
      break
    }
  }
}
export { arrow }

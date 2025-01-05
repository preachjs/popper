import { arrow } from './bundle/arrow.js'
import { createPopper } from './bundle/index.js'

const anchor = document.getElementById('anchor')
const target = document.getElementById('menu')
const arrowEl = document.getElementById('arrow')
const showArrowCheckbox = document.getElementById('showArrow')

let popper = createPopper(anchor, target)
const positionButtons = document.querySelectorAll('[data-position]')
const alignedButtons = document.querySelectorAll('[data-align]')
const offsetRange = document.querySelector('#offsetRange')

let currentPosition = 'bottom'
let currentAlign = 'center'

popper.use(arrow(arrowEl))

popper.toggleArrow(showArrowCheckbox.checked)

showArrowCheckbox.addEventListener('change', e => {
  popper.toggleArrow(e.target.checked)
  popper.align()
})

const resizeObserver = new ResizeObserver(entries => {
  let lastEntry
  for (const entry of entries) {
    if (lastEntry) {
      if (
        lastEntry.contentRect.height != entry.contentRect.height ||
        lastEntry.contentRect.width != entry.contentRect.width
      ) {
        popper
          .move(currentPosition, currentAlign)
          .offset(Number(offsetRange.value))
          .align()
      }
    }
    if (!lastEntry) {
      lastEntry = entry
      popper
        .move(currentPosition, currentAlign)
        .offset(Number(offsetRange.value))
        .align()
    }
  }
})

resizeObserver.observe(anchor)
resizeObserver.observe(arrowEl)
resizeObserver.observe(target)

offsetRange.addEventListener('change', e => {
  popper.offset(Number(e.target.value)).align()
})

positionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    popper
      .move(btn.dataset.position, currentAlign)
      .offset(Number(offsetRange.value))
      .align()
    currentPosition = btn.dataset.position
  })
})

alignedButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    popper
      .move(currentPosition, btn.dataset.align)
      .offset(Number(offsetRange.value))
      .align()
    currentAlign = btn.dataset.align
  })
})

popper
  .move(currentPosition, currentAlign)
  .offset(Number(offsetRange.value))
  .align()

import { createPopper } from './bundle/index.js'

const anchor = document.getElementById('anchor')
const target = document.getElementById('menu')
const popper = createPopper(anchor, target)

const positionButtons = document.querySelectorAll('[data-position]')
const alignedButtons = document.querySelectorAll('[data-align]')
const offsetRange = document.querySelector('#offsetRange')

let currentPosition = 'bottom'
let currentAlign = 'center'

window.addEventListener('resize', () => {
  popper
    .move(currentPosition, currentAlign)
    .offset(Number(offsetRange.value))
    .align()
})

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

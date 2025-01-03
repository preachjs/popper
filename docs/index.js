import { createPopper } from './bundle/index.js'

const anchor = document.getElementById('anchor')
const target = document.getElementById('menu')
const popper = createPopper(anchor, target)

const positionButtons = document.querySelectorAll('[data-position]')
const alignedButtons = document.querySelectorAll('[data-align]')

let currentPosition = 'bottom'
let currentAlign = 'center'

positionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    popper.move(btn.dataset.position, currentAlign).align()
    currentPosition = btn.dataset.position
  })
})

alignedButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    popper.move(currentPosition, btn.dataset.align).align()
    currentAlign = btn.dataset.align
  })
})

popper.move(currentPosition, currentAlign).offset(10).align()

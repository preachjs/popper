import { createPopper } from './bundle/index.js'

const anchor = document.getElementById('anchor')
const target = document.getElementById('menu')

const popper = createPopper(anchor, target)

popper.move('top', 'end').offset(2).align()

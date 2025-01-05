# @preachjs/popper

- [@preachjs/popper](#preachjspopper)
  - [Highlights](#highlights)
  - [Usage](#usage)
    - [Installation](#installation)
    - [Example](#example)
    - [Plugins](#plugins)
      - [Arrow](#arrow)
  - [About](#about)
  - [FAQ](#faq)
  - [License](#license)

## Highlights

- Tiny
  - Core is just under [3kb](https://sizesnap.barelyhuman.dev/@preachjs/popper)
- 0 dependencies
- Low Level

## Usage

### Installation

> [!NOTE]
>
> The module is **ESM Only**

```sh
npm i @preachjs/popper
```

### Example

```js
import { createPopper } from '@preachjs/popper'

const anchor = document.getElementById('anchor')
const popover = document.getElementById('menu')

const popper = createPopper(anchor, popover)

popper.move('bottom', 'center').offset(2)

// Doesn't do anything unless `.align` is called a.k.a, a Lazy API
popper.align()
```

### Plugins

#### Arrow

```js
import { arrow } from '@preachjs/popper/arrow'
import { createPopper } from '@preachjs/popper'

const arrowElement = document.getElementById('arrow')

const popper = createPopper(anchor, popover)
popper.use(arrow(arrowElement))

popper.toggleArrow()
// or
// popper.toggleArrow(true) - will add a `data-popper-arrow-visible` property on the passed arrow element
// popper.toggleArrow(false)

// remaining code

popper.align()
```

## About

`popper` is a tiny low level vanilla javascript library built to support other
UI components that preachjs wishes to build. It doesn't have magical behaviours
and just manages semantic positioning.

Behaviours would differ based on the UI component it's being used in and will
normally involve something like Preact(+Signals) that handle state

## FAQ

**Why not use X**?

Probably too large of an API surface area or overall size which I wish to avoid,
at least right now.

**It's missing XYZ!**

Feel free to raise feature requests, do know that the scope of the library
itself is pretty small. You can always write plugins to extend it's behaviour.

## License

[MIT](/LICENSE)

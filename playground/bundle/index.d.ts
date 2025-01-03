declare module '@preachjs/popper/index' {
  export function createPopper(anchor: HTMLElement, target: HTMLElement): Popper;
  type Position = "top" | "left" | "right" | "bottom";
  type Alignment = "center" | "start" | "end";
  class Popper {
      anchor: HTMLElement;
      target: HTMLElement;
      _position: Position;
      _alignment: Alignment;
      _offset: number;
      constructor(anchor: HTMLElement, target: HTMLElement);
      move(position?: Position, alignment?: Alignment): this;
      offset(num: number): this;
      align(): void;
  }
  export {};

}
declare module '@preachjs/popper' {
  import main = require('@preachjs/popper/src/index');
  export = main;
}
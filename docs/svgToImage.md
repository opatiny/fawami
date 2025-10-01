# Convert svg to image issue

## Steps

- load xml
- create DOM from the text svg to access all the structure recursively
- use `dom.setAttribute` to fill all paths with black and remove `class` property
- fill in black
- paint paths on canvas with `skia-canvas`
  - create a canvas

- final image

## Libraries

- `skia-canvas`: convert svg to png
- `jsdom`: emulate dom in node (instead of having by default in browser)

# FaWaMi: Fabric waste minimization project

## Project structure idea

- `data`: some tests data
- `demo`: contains some code that imports the functions defined in `src` and displays a GUI with the results
- `src`: contains the actual code. All functions are unit tested

## Concept for the GUI

- Form to select an input svg file
- Drop-down for optimisation algorithm selection
- Some options buttons: orientation, space between parts, ...
- Graphics zone with the results of the opti displayed as an image

## Run a script

Simply use `node yourScript.ts`. In the latest node version, you don't need to transpile ts code anymore, as you did using `ts-node` for instance.

In watch mode: `node --watch yourScript.ts`

## Running tests

- To run all tests once: `npm run test-only`
- Rerun on change:

## Convert SVG to a PNG or other image format

- https://www.npmjs.com/package/svg2img
- https://www.npmjs.com/package/html-to-image
- https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser

## Questions

- how to make the debugger work to inspect variables?
- why can't I run scripts with `ts-node`? Is it because I have a module? Should I use `tsx` instead?

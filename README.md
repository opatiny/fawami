# FaWaMi: Fabric waste minimization project

## Project structure idea

- `data`: some tests data
- `demo`: contains some code that imports the functions defined in `src` and displays a GUI with the results
- `src`: contains the actual code. All functions are unit tested

## Concept for the GUI

- Input an SVG image with the pattern pieces to place on the fabric
- Define the fabric dimensions (if rectangular). We'll see if we handle not rectangular shapes.
- Drop-down for optimisation algorithm selection
- Some options buttons: orientation, space between parts (padding), ...
- Graphics zone with the results of the opti displayed as an image

## Run a script

Simply use `node yourScript.ts`. In the latest node version, you don't need to transpile ts code anymore, as you did using `ts-node` for instance.

In watch mode: `node --watch yourScript.ts`

## Running tests

- To run all tests once: `npm run test-only`
- Watch mode: `npx vitest` (no coverage)
- Focus on one test: `npx vitest testName`

## TS tips

- `structuredClone(object)`: create a typed copy of the object
- random values with seed: use the `XSadd` library

## Create a gif from set of images

This command adds a longer delay (of 100) before the first and last images.

```bash
convert -delay 40 -loop 0 *.png -set delay '%[fx:t==(n-1) || t==0 ? 100 : 40]'  mutateTranslate.gif
```

## Question`

- how to make the debugger work to inspect variables?

```

```

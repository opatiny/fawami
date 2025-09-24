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

## Running tests

To run all tests: `npm run test-only`

## Questions

- how to make the debugger work to inspect variables?
- why can't I run scripts with `ts-node`?

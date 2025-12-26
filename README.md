# FaWaMi: Fabric waste minimization project

## Project structure

- `data`: some test data
- `demo`: contains example scripts that imports the functions defined in `src` and displays a GUI with the results
- `src`: contains the actual code. All functions are unit tested

## Run a script

Simply use `node yourScript.ts`. In the latest node version, you don't need to transpile ts code anymore, as you did using `ts-node` for instance.

In watch mode: `node --watch yourScript.ts`

## Running the unit tests

- To run all tests once: `npm run test-only`
- Watch mode: `npx vitest` (no coverage)
- Focus on one test: `npx vitest testName`

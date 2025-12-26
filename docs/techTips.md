# Technical tips

## TS and Node.js tips

Typescript:

- `structuredClone(object)`: create a typed copy of the object
- random values with seed: use the `ml-random` library
- add types for a library: `npm i @types/thePackage`
- check the limiting step of the algorithm: use the `--cpu-prof` option
  ```ts
  node --cpu-prof ./demo/index.ts
  ```

Node.js

- install newest version of package: `npm i image-js@latest`

## Generating SVG charts

We are using the `echarts` library, which allows to create backend and frontend charts: https://echarts.apache.org/examples/en/index.html

## Create a gif from set of images in the command line

This command adds a longer delay (of 100) before the first and last images.

```bash
convert -resize 20% -delay 40 -loop 0 *.png -set delay '%[fx:t==(n-1) || t==0 ? 100 : 40]'  mutateTranslate.gif
```

- Remove the `resize` option if you don't want to scale down

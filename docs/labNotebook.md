# Project lab notebook

## 2025.10.15

- when we move some parts we'll have to clamp the position in order to remain inside of the fabric
- how to deal with "copies" of the masks? I want to have multiple sets of pieces with different origins and orientations without copying all the other properties.
  Solution: create a `clone()` function on the `PatternPiece` class.
- how to deal with orientation when computing overlap, and when drawing the masks on the fabric?
  - first of all we'll limit ourselves to the 4 cardinal orientations
  - for overlap, implement the function that does the correct geometric conversion
  - for drawing the masks: add a method to `PatternPiece` called `getRotatedMask` which returns the mask with correct orientation

## 2025.11.06

- added orientation handling to all existing functions
- created function to compute distance between two genes

todo:

- create a `Gene` class containing data and fitness, and potentially other stats (`overlap`, `usedLength`)
  - use getters to compute on the fly
  - `toJSON` method to display all stats from different genes as a table with `console.table()`

## 2026.11.12

questions:

- how to pick the N most diverse elements from a dataset? -> kmeans
- is there a way of deleting variables after you're done using them, to free memory? -> done automatically by garbage collector when no more pointer to the variable
- how to add some text on an image? -> new version of `image-js`
- why isn't `ls -1 | sort --numeric-sort` working? -> probably need a separator for it to work

- how to remove console.log being an error?
- how to avoid `number | undefined` errors? when I access an element of an array
- how to implement functions that act on an array of class instances? can you put it directly in the class?

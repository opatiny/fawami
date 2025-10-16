# Project lab notebook

## 2025.10.15

- when we move some parts we'll have to clamp the position in order to remain inside of the fabric
- how to deal with "copies" of the masks? I want to have multiple sets of pieces with different origins and orientations without copying all the other properties.
  Solution: create a `clone()` function on the `PatternPiece` class.
- how to deal with orientation when computing overlap, and when drawing the masks on the fabric?
  - first of all we'll limit ourselves to the 4 cardinal orientations
  - for overlap, implement the function that does the correct geometric conversion
  - for drawing the masks: add a method to `PatternPiece` called `getRotatedMask` which returns the mask with correct orientation

import { expect, test } from 'vitest';

import { helloWorld, myModule } from '../index.ts';

test('should return 42', () => {
  expect(myModule()).toBe(42);
});

test('should return Hello, World!', () => {
  expect(helloWorld()).toBe('Hello, World!');
});

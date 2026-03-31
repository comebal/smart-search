import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // This tells Vitest to simulate a browser
    environment: 'jsdom', 
    // This allows the use of 'describe' and 'it' without imports
    globals: true,
  },
});
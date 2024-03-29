# Creating a TypeScript React Application with Vite

This project was bootstrapped with

[npm create vite@latest dunderdle -- --template react-ts](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

Added Tailwind CSS

https://tailwindcss.com/docs/guides/vite

Added Vitest, unit-test framework
powered by Vite

https://vitest.dev/

Added Zustand, to handle state

https://github.com/pmndrs/zustand

---

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all the dependencies

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

---

## Vitest UI

You can also run vitest using a UI, which can help you visualize what tests you are running, and their results.

### `npm i -D @vitest/ui`

Installs the required package

### `npx vitest --ui`

Runs the tests\
Open [http://localhost:51204/\_\_vitest\_\_/](http://localhost:51204/__vitest__/) to view it in your browser.

---

## Zustand

You can also run vitest using a UI, which can help you visualize what tests you are running, and their results.

### `npm install zustand`

Installs the required package

### `useStore.persist.clearStorage();`

This can be used to fully clear the persisted value in the storage.

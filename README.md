# EFAI Genebox Admin Web

## Basic development environment & tools

- [Node.js](https://nodejs.org/en) (v18.18.2)
- [TypeScript](https://www.typescriptlang.org/)
- [Naive UI](https://www.naiveui.com/)

## Building development environment

- Install dependencies with dependency manager (yarn as default)

  ```
  $ yarn
  ```

- Set environment variables

  - Set basic variables in `.env.local`.

- Start dev server

  ```
  $ yarn dev
  ```

## Project Structure

```
### main folder & file structure
|-- dist
|-- public
|-- src
    |-- assets
    |-- components (generic components)
    |-- layouts
    |-- libs
    |-- router
    |-- services
      |-- api
    |-- stores
    |-- styles
    |-- utils
      |-- config
      |-- helpers
    |-- views (pages)
    |-- App.tsx
    |-- global.d.ts (type declaration file)
    |-- main.tsx
|-- .env
|-- .env.local
|-- index.html
```

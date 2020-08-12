## this package was generated from the blueprint-templates/ro-nano-starter in the ro-libs repo

From the time that I used the nano-react-app tool to build this project, I made a few notable changes that would better suit me as a starter template.

The following list does not include all the options I decided to remove from the original creation of nano-react-app. This doesn't mean any of those configurations won't be added in the future. I just didn't need them to get a simple project up and running.

- `tsconfig.json` settings
  - kept `"jsx":"react"`
    - used for typescript to understand jsx
  - added `"esModuleInterop": true`
    - general setting so React can be imported with:
      - import `React from 'react';`
      - instead of: `import \* as React from 'react';`
  - kept `"include": ["src/**/*"],`
    - make sure typescript only looks at files in the src folder
  - `"exclude": ["node_modules", "**/*.test.*"]`
    - `"node_modules"`, so accidental changes to this config file in the future doesn't make typescript try to compile modules
    - `"**/*.test.*"` so typescript ignores tests. Explained in more detail in the following testing section
- `package.json`
  - `private: true`
    - so apps are never published as packages to npm. This is especially useful for setting up project inside a lerna mono-repo
  - `--out-dir docs` in build/start scripts
    - so the build version can be easily published to github pages by ticking on the docs setting. The original default was to a /dist folder. There may be cases where this is needed, so this setting should be removed in preference for the default
  - test scripts: explained in the testing section below
- `.gitignore`
  - added `docs` for the changed output build file explained above
- **Added Testing**
  - The creator(s) of the nano-react-app decided against including testing in the original templates to reduce bulk, so I manually added that in.
  - testing dependencies
    - `"@types/jest"` jest types for typescript
    - `"@testing-library/jest-dom"` added helpers to extend jests expect in tests
    - `"@testing-library/react"` preferred and currently most recommended testing library to be used with react and other ui libraries
    - `"jest"` testing library of choice
    - `ts-jest` used to help make jest compatible with typescript
  - test scripts
    - test & test:watch
      - `jest --watch --no-cache`
        - `jest` : runs jest using the configurations in the `jest.config.js` file
        - `--watch` : used for watch mode to watch for changes
        - `--no-cache` : used in watch mode to fix
      - `"coverage": "jest --coverage && .\\coverage\\lcov-report\\index.html"`
        - runs coverage report and opens up the final report in the browser
  - jest configuration: `jest.config.json`
    - transform: matcher to tell with files to run through ts-jest
    - testMatch: glob to match test files in src folder. I generally stick to using `.test.(t/j)s` files for tests, but this might need to be expanded for files such as `.spec.js` in larger projects
    - moduleFileExtensions: the allowed extensions that jest will look for from left to right when node extensions are provided in import statements
    - setupFilesAfterEnv: a replacement for the old jest setting _setupTestFrameworkScriptFile_. This is now an array of setup files that will be run before every test file to setup tests after the overall test environment is set up. Use of this is explained in more detail below in the section about `jest.setup.ts`
  - `jest.setup.ts`
    - this file is added in `jest.config.json` and runs after expect is available to setup jest with extensions to run before every test suite file in the project. Having expect available is important for the command `import '@testing-library/jest-dom';` which extends expect with helpful dom test functions while using `@testing-library/react`
  - `App.test.tsx`
    - simple starter file with an example test usage of `@testing-library/react` for our basic project

# The following is from the official documentation off the nano-react-app project

## Nano React App Default Javascript Template

The default template project for [nano-react-app](https://github.com/adrianmcli/nano-react-app).

- `npm start` — This will spawn a development server with a default port of `1234`.
- `npm run build` — This will output a production build in the `dist` directory.
- `npm run typecheck` — This will run `tsc --noEmit` which basically just typechecks your project.
- `npm run typewatch` — This will run `tsc --noEmit --watch` which will typecheck your project as you make changes.

## Typechecking

Unforunately, Parcel does not perform typechecking. So you will need to make use of the `typecheck` and `typewatch` scripts above.

## Custom port

You can use the `-p` flag to specify a port for development. To do this, you can either run `npm start` with an additional flag:

```
npm start -- -p 3000
```

Or edit the `start` script directly:

```
parcel index.html -p 3000
```

## Adding styles

You can use CSS files with simple ES2015 `import` statements anywhere in your Javascript:

```js
import './index.css';
```

## Babel transforms

The Babel preset [babel-preset-nano-react-app](https://github.com/nano-react-app/babel-preset-nano-react-app) is used to support the same transforms that Create React App supports.

The Babel configuration lives inside `package.json` and will override an external `.babelrc` file, so if you want to use `.babelrc` remember to delete the `babel` property inside `package.json`.

## Deploy to GitHub Pages

You can also deploy your project using GitHub pages.
First install the `gh-pages` [package](https://github.com/tschaub/gh-pages):

`npm i -D gh-pages`

With Parcel's `--public-url` flag, use the following scripts for deployment:

```
"scripts": {
  "start": "parcel index.html",
  "build": "parcel build index.html --public-url '.'",
  "predeploy": "rm -rf dist && parcel build index.html --public-url '.'",
  "deploy": "gh-pages -d dist"
},
```

Then follow the normal procedure in GitHub Pages and select the `gh-pages` branch.

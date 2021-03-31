# Hydra IDE

Hydra IDE is simplified code IDE component based on monaco editor for React apps. It has no dependencies as you have to install them yourself inside your project

## Installation in React project

```sh
npm i hydra-ide
```

Install peer dependencies

```sh
npm i react react-dom monaco-editor
```

and install peer development dependencies. It usese webpack to add worker with monaco inside.

```sh
npm i -D webpack monaco-editor-webpack-plugin worker-loader file-loader css-loader
```

add monaco plugin to webpack.

```js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
module.exports = {
  plugins: [
    new MonacoWebpackPlugin({
      // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      // Add your languages here
      languages: ['javascript'],
    }),
  ],
};
```

You can check exact webpack configuration in `sandbox` folder.

## How to use?

```tsx
import React, { useState } from 'react';
import HydraIDE from '@/HydraIDE';
import { darken, lighten, toHex } from 'color2k';

export const Colors = {
  grey: '#F3F3F4',
  main: '#d966ff',
  green: '#acf7c1',
  yellow: '#cfee9e',
  red: '#de3c4b',
  orange: '#f18f01',
  pink: '#e6bccd',
  blue: '#17bebb',
  sky: '#A3E7FC',
} as const;

export const Main = () => {
  const [value, setValue] = useState('');

  return (
    <div style={{ height: `100%`, width: '100%' }}>
      <HydraIDE
        editorOptions={{
          language: 'javascript',
        }}
        theme={{
          base: 'vs-dark',
          inherit: true,
          rules: [
            {
              token: 'comment.js',
              foreground: toHex(darken(Colors.grey, 0.5)),
            },
            { token: 'keyword.js', foreground: Colors.main },
            { token: 'number.js', foreground: Colors.green },
            { token: 'string.js', foreground: Colors.sky },
            {
              token: 'identifier.js',
              foreground: toHex(darken(Colors.sky, 0.21)),
            },
            {
              token: 'type.identifier.js',
              foreground: toHex(lighten(Colors.sky, 0.1)),
            },
          ],
          colors: {
            'editor.foreground': Colors.sky,
            'editor.background': toHex(darken(Colors.main, 0.63)),
            'minimap.background': toHex(darken(Colors.main, 0.64)),
          },
        }}
        setValue={setValue}
        value={value}
      />
    </div>
  );
};
```

## Develop

To run sandbox environment clone this repo, install deps and run start.

```sh
npm run start
```

## Roadmap

- easier token adding
- easier color customization

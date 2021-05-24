# lib-tool

Zero configuration, easy way to package a component library.

**Features**

- Zero configuration.
- Support JavaScript, TypeScript, React.
- Support both ESM and CJS.
- Support both Less and Sass.

# Installation

**npm**

```sh
npm install -D lib-tool
```

**yarn**

```sh
yarn add lib-tool --dev
```

### Setup

**package.json**

```json
{
  "scripts": {
    "build": "lib-tool"
  }
}
```

By default, one of the `['src/index.js', 'src/index.ts', 'src/index.jsx', 'src/index.tsx']` will be found as the entry file.

## Configuration

If you want to add more configuration items, you can create a configuration file.

create `.toolrc.js` of `.toolrc.ts`.

```javascript
// .toolrc.js
export default {
  entry: 'components/index.tsx',
  lessOptions: {
    javascriptEnabled: false, // default true
  },
  fileFilter: filePath => !filePath.includes('ignore_dir'),
  copyOriginalStyle: false, // default true
  onlyDependencyFile: {
    tsConfigPath: './tsconfig.json',
    webpackConfigPath: './webpack.config.js',
  },
  babelPlugins: [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-export-default-from',
  ],
};
```

**Full definition**

```typescript
interface UserConfig {
  /**
   * entry path
   */
  entry?: string
  /**
   * output folder name
   */
  outDir?: OutDir
  /**
   * pattern used to match files, only on 'onlyDependencyFile = false'
   */
  pattern?: string
  browserslist?: string | string[] | { [key: string]: string }
  babelPlugins?: PluginItem[]
  /**
   * copy original style file to outDir,default true
   */
  copyOriginalStyle?: boolean
  /**
   * lib-tool default matches files using the pattern,
   * this option will only matches dependent files.
   */
  onlyDependencyFile?:
    | boolean
    | {
        tsConfigPath?: string
        webpackConfigPath?: string
      }
  /**
   * filter files
   */
  fileFilter?: (path: string) => boolean
  lessOptions?: Less.Options
  sassOptions?: Omit<SassOptions, 'file'>
}
```


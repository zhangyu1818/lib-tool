# lib-tool

零配置，用简单的方式来打包一个组件库 📦。

**功能**

- 零配置。
- 支持 JavaScript、TypeScript、React。
- 同时支持 ESM 和 CJS 的打包。
- 同时支持 Less、Sass、CSS 的打包。

## 安装

**npm**

```sh
npm install -D lib-tool
```

**yarn**

```sh
yarn add lib-tool --dev
```

### 使用

在**package.json**中引用。

```js
{
  "scripts": {
    "build": "lib-tool"
  }
}
```

或直接执行命令。

```sh
$ lib-tool
```

默认情况下，`lib-tool`会以匹配模式来打包，即会打包入口目录下的所有文件。

`lib-tool`是文件到文件进行编译，这代表输出的结构会和输入的结构一致，而不会打包为一个`bundle.js`文件。

## 配置文件

如果你想添加更多配置，那么可以创建配置文件。

新建`toolrc.js`或`toolrc.ts`，推荐使用`.ts`文件配置，因为可以获得类型提示。

```typescript
// toolrc.ts
import type { UserConfig } from 'lib-tool'
export default {
  entry: 'components/index.tsx',
  lessOptions: {
    javascriptEnabled: false, // 默认为 true
  },
  fileFilter: (filePath) => !filePath.includes('ignore_dir'),
} as UserConfig
```

## 配置项

**entry** `string`

打包入口，在`match`模式下可为入口目录，`dependence`模式下为入口文件路径，默认情况会寻找`src/index.(js|jsx|ts|tsx)`。

**outDir** `OutDir`

打包输出目录，`key`为打包格式，默认值：

```js
{
  esm: 'es',
  cjs: 'lib',
}
```

**mode** `Mode`

打包分为`match`和`dependence`两种模式，默认为`match`模式。

- `match` 模式直接以入口目录作为匹配，打包目录下所有文件。
- `dependence`模式只根据入口文件所依赖的文件打包。

**pattern** `string`

寻找文件的匹配符，只在`match`模式下生效，默认值：`**/*.*(js|ts|jsx|tsx)`。

**copyStyles** `boolean`

是否拷贝原样式文件到输出目录，默认为`false`。

**babelConfig** `(format: Format) => TransformOptions`

自定义`babel`配置项，`format`为当前的打包格式，`cjs`或`esm`，默认配置：

```js
{
    presets: [
      [
        require.resolve('@babel/preset-typescript'),
        {
          isTSX,
          allExtensions: isTSX,
        },
      ],
      require.resolve('@babel/preset-react'),
      [
        require.resolve('@babel/preset-env'),
        {
          modules: format === 'esm' ? false : 'auto',
          targets: {
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 11'],
          },
        },
      ],
    ],
  }
```

**tsConfigPath** `string`

`ts`配置文件路径，`dependence`下生效，默认寻找根目录`tsconfig.json`。

**webpackConfigPath** `string`

`webpack`配置文件路径，`dependence`下生效，默认寻找根目录`webpack.config.js`。

**filter** `(path: string) => boolean`

过滤文件，可用于只打包某类文件。

**lessOptions** `Less.Options`

`less`的配置。

**sassOptions** `SassOptions`

`sass`的配置。

## Cli

`lib-tool ` 执行打包。

- `--entry` 打包入口。
- `--mode` 打包模式。
- `--outDir` 输出目录。
- `--format`打包格式。

Example:

```sh
lib-tool --entry entry/index.ts --mode dependence --format esm --outDir dist
```

## 多配置

配置文件可以导出一个多配置数组。

Example:

依赖打包`components/index.tsx`以`esm`格式打包到`dist`目录，打包`components`目录下所有`less`文件到`styles`目录。

```typescript
import { UserConfig, babelConfig } from "lib-tool";

export default [
  {
    entry: "components/index.tsx",
    outDir: {
      esm: "dist",
    },
    mode: "dependence",
    babelConfig: (format) => ({
      ...babelConfig(format),
      plugins: [
        [
          "module-resolver",
          {
            root: ".",
            alias: {
              "@utils": "./components/utils",
            },
          },
        ],
      ],
    }),
  },
  {
    entry: "components",
    outDir: {
      esm: "styles",
    },
    filter: (path) => path.endsWith(".less"),
  },
] as UserConfig[];
```

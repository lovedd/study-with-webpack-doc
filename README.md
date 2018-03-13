# study-with-webpack-doc
folllow the webpack doc, just do it. 


#1. commit 隐式依赖

在此示例中，<script> 标签之间存在隐式依赖关系。index.js 文件执行之前，还依赖于页面中引入的 lodash。之所以说是隐式的是因为 index.js 并未显式声明需要引入 lodash，只是假定推测已经存在一个全局变量 _。

使用这种方式去管理 JavaScript 项目会有一些问题：

* 无法立即体现，脚本的执行依赖于外部扩展库(external library)。
* 如果依赖不存在，或者引入顺序错误，应用程序将无法正常运行。
* 如果依赖被引入但是并没有使用，浏览器将被迫下载无用代码。

#2. commit npx打包依赖放入dist
首先，我们稍微调整下目录结构，将“源”代码(/src)从我们的“分发”代码(/dist)中分离出来。“源”代码是用于书写和编辑的代码。“分发”代码是构建过程产生的代码最小化和优化后的“输出”目录，最终将在浏览器中加载。
执行 npx webpack，会将我们的脚本作为入口起点，然后输出为 bundle.js

Node 8.2+ 版本提供的 npx 命令，可以运行在初始安装的 webpack 包(package)的 webpack 二进制文件（./node_modules/.bin/webpack）
```
npx webpack src/index.js --output dist/bundle.js
```

#3. commit 通过配置文件构建
```
npx webpack --config webpack.config.js
```
如果 webpack.config.js 存在，则 webpack 命令将默认选择使用它。我们在这里使用 --config 选项只是向你表明，可以传递任何名称的配置文件。这对于需要拆分成多个文件的复杂配置是非常有用。

#4. commit 通过package启动
```
"scripts": {
    "build": "webpack"
  }
```
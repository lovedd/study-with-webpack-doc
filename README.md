# study-with-webpack-doc
folllow the webpack doc, just do it. 


###1. commit 隐式依赖

在此示例中，\<script>标签之间存在隐式依赖关系。index.js 文件执行之前，还依赖于页面中引入的 lodash。之所以说是隐式的是因为 index.js 并未显式声明需要引入 lodash，只是假定推测已经存在一个全局变量 _。

使用这种方式去管理 JavaScript 项目会有一些问题：

* 无法立即体现，脚本的执行依赖于外部扩展库(external library)。
* 如果依赖不存在，或者引入顺序错误，应用程序将无法正常运行。
* 如果依赖被引入但是并没有使用，浏览器将被迫下载无用代码。

###2. commit npx打包依赖放入dist
首先，我们稍微调整下目录结构，将“源”代码(/src)从我们的“分发”代码(/dist)中分离出来。“源”代码是用于书写和编辑的代码。“分发”代码是构建过程产生的代码最小化和优化后的“输出”目录，最终将在浏览器中加载。
执行 npx webpack，会将我们的脚本作为入口起点，然后输出为 bundle.js

Node 8.2+ 版本提供的 npx 命令，可以运行在初始安装的 webpack 包(package)的 webpack 二进制文件（./node_modules/.bin/webpack）
```
npx webpack src/index.js --output dist/bundle.js
```

###3. commit 通过配置文件构建
```
npx webpack --config webpack.config.js
```
如果 webpack.config.js 存在，则 webpack 命令将默认选择使用它。我们在这里使用 --config 选项只是向你表明，可以传递任何名称的配置文件。这对于需要拆分成多个文件的复杂配置是非常有用。

###4. commit 通过package启动
```
"scripts": {
    "build": "webpack"
  }
```

###5.commit 加载css
**css-loader**: 解释(interpret) @import 和 url() ，会 import/require() 后再解析(resolve)它们。

**style-loader**: Adds CSS to the DOM by injecting a \<style> tag

```
module: {
        rules: [
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
```

###6. commit 图片加载
**file-loader**: 当你使用import MyImage from './my-image.png'时，该图像将被处理并添加到 output 目录，并且 MyImage 变量将包含该图像在处理后的最终 url。

**css-loader**：CSS 中的 url('./my-image.png') 会使用类似的过程去处理。loader 会识别这是一个本地文件，并将 './my-image.png' 路径，替换为输出目录中图像的最终路径。

**html-loade**: 以相同的方式处理 \<img src="./my-image.png" />。

```
{
    test: /.(png|svg|jpg|gif)$/,
    use: [
        'file-loader'
    ]
}
```

###7. commit 加载字体
file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录
```
{
    test:/\.(woff|woff2|eot|ttf|otf)$/,
    use: [
        'file-loader'
    ]
}
```

###8. commit 加载数据
此外，可以加载的有用资源还有数据，如 JSON 文件，CSV、TSV 和 XML。类似于 NodeJS，JSON 支持实际上是内置的，也就是说 import Data from './data.json' 默认将正常运行。要导入 CSV、TSV 和 XML，你可以使用 csv-loader 和 xml-loader。
```
{
    test: /\.(csv|tsv)$/,
        use: [
    'csv-loader'
]
},
{
    test: /\.xml$/,
        use: [
    'xml-loader'
]
}
```
在使用 d3 等工具来实现某些数据可视化时，预加载数据会非常有用。我们可以不用再发送 ajax 请求，然后于运行时解析数据，而是在构建过程中将其提前载入并打包到模块中，以便浏览器加载模块后，可以立即从模块中解析数据。

###9. commit 多入口输入输出
```
entry: {
    app: './src/index.js',
    print: './src/print.js'
},
output: {
    filename: "[name].bundle.js",
    // path.resolve()方法可以将多个路径解析（类似于cd操作）为一个规范化的绝对路径
    // __dirname是当前文件所在的文件目录
    // 表示不管在哪里运行该代码，始终将path指定为与webpackconfig.js同级的dist目录
    path: path.resolve(__dirname, 'dist')
}
```
生成的包将被重命名在一个构建中，但是我们的index.html文件仍然会引用旧的名字。需要手动更改，接下来我们用 HtmlWebpackPlugin 来解决这个问题。

###10. commit HtmlWebpackPlugin
HtmlWebpackPlugin 创建了一个全新的文件，所有的 bundle 会自动添加到 html 中。

###11. commit 清理/dist文件夹
clean-webpack-plugin 在每次构建前清理 /dist 文件夹

###12. commit source map
开发环境使用dev-tool开启，帮助捕捉错误信息，精确显示错误代码地址

###13. commit watch
每次改动代码以后npm run build很麻烦。可以自动监听改动编译代码，有3中办法。

第1种就是watch。文件改动后自动编译，但浏览器不会自动加载，需要手动刷新。

###14. commit webpack-dev-server
```
devServer: {
        contentBase: './dist'
    },
```
以上配置告知 webpack-dev-server，在 localhost:8080 下建立服务，将 dist 目录下的文件，作为可访问文件。

修改和保存任意源文件，web 服务器就会自动重新加载编译后的代码

###15. commit webpack-dev-middleware
webpack-dev-middleware 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。
webpack-dev-server 在内部使用了它，同时，它也可以作为一个单独的包来使用，以便进行更多自定义设置来实现更多的需求。
可以自己写服务器逻辑，非常灵活。此时需要手动刷新。

###16. commit 启用HMR
其实在启用HMR之前，我将入口出口调整为一个，使用webpack-dev-server也是可以热更新的，所以不清楚这里为什么还需要一堆配置。看来回头还要好好琢磨一下。

我想，这里热更新主要是为了在依赖模块里做监听和处理操作吗？就像这里，可以在index监听到print的改变而做出处理。

果你使用了 webpack-dev-middleware 而没有使用 webpack-dev-server，请使用 webpack-hot-middleware package 包，以在你的自定义服务或应用程序上启用 HMR。

###17. commit HMR问题
上个提交中，按钮的 onclick 事件仍然绑定在旧的 printMe 函数上。

为了让它与 HRM 正常工作，我们需要使用 module.hot.accept 更新绑定到新的 printMe 函数上。

幸运的是，存在很多 loader（其中一些在下面提到），使得模块热替换的过程变得更容易。

例如：
style-loader css-loader： 热加载样式表。
Vue Loader：此 loader 支持用于 vue 组件的 HMR，提供开箱即用体验。

#####跳过了tree shaking这一节，一直无法实现，回头再来看。

#18. commit 区分环境配置
1. 这里我好想明白了tree shaking不成功的原因，要使用uglifyjs-webpack-plugin
还有其他插件可以压缩代码：
* BabelMinifyWebpackPlugin
* ClosureCompilerPlugin

但需要注意实现删除未引用代码(dead code)的能力

2. 生产环境也建议开启source map，只不过和dev环境的devtool选项不同。避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能。

3.环境配置：
利用DefinePlugin 插件
技术上讲，NODE_ENV 是一个由 Node.js 暴露给执行脚本的系统环境变量。通常用于决定在开发环境与生产环境(dev-vs-prod)下，服务器工具、构建脚本和客户端 library 的行为。然而，与预期不同的是，无法在构建脚本 webpack.config.js 中，将 process.env.NODE_ENV 设置为 "production"，请查看 #2537。因此，例如 process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js' 这样的条件语句，在 webpack 配置文件中，无法按照预期运行。
另外，任何位于 /src 的本地代码都可以关联到 process.env.NODE_ENV 环境变量


##### 使用 ExtractTextPlugin 将 CSS 分离成单独的文件

##### 再往后涉及到性能优化
1. 去重：

* ExtractTextPlugin: 用于将 CSS 从主应用程序中分离。
* bundle-loader: 用于分离代码和延迟加载生成的 bundle。
* promise-loader: 类似于 bundle-loader ，但是使用的是 promises。

2. 动态导入
* 优先选择的方式是，使用符合 ECMAScript 提案 的 import() 语法。
* 使用 webpack 特定的 require.ensure

3. 懒加载

###注： 还没有完成学习，慢慢实践和学习中~~
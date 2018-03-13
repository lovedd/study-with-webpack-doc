# study-with-webpack-doc
folllow the webpack doc, just do it. 


#1. commit 隐式依赖

在此示例中，\<script>标签之间存在隐式依赖关系。index.js 文件执行之前，还依赖于页面中引入的 lodash。之所以说是隐式的是因为 index.js 并未显式声明需要引入 lodash，只是假定推测已经存在一个全局变量 _。

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

#5.commit 加载css
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

#6. commit 图片加载
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

#7. commit 加载字体
file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录
```
{
    test:/\.(woff|woff2|eot|ttf|otf)$/,
    use: [
        'file-loader'
    ]
}
```

#8. commit 加载数据
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

#9. commit 多入口输入输出
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

#10. commit HtmlWebpackPlugin
HtmlWebpackPlugin 创建了一个全新的文件，所有的 bundle 会自动添加到 html 中。

#11. 
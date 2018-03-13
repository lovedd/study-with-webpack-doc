/**
 * Created by liuliu on 2018/3/13.
 */

var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: "bundle.js",
        // path.resolve()方法可以将多个路径解析（类似于cd操作）为一个规范化的绝对路径
        // __dirname是当前文件所在的文件目录
        // 表示不管在哪里运行该代码，始终将path指定为与webpackconfig.js同级的dist目录
        path: path.resolve(__dirname, 'dist')
    }
}
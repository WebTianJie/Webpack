const path = require('path');
const glob = require('glob-all')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//PurifyCssPlugin
const WebpackDeepScopeAnalysisPlugin = require("webpack-deep-scope-plugin").default;
const PurifyCssPlugin = require('purifycss-webpack');
const HtmlWithimgLoader = require("html-withimg-loader");
module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'js/[name][hash:5].bound.js' //设打包后的js文件的名字
    },
    module: {
        rules: [
            {
                test: /\.(htm|html)$/,
                loader: 'html-withimg-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,//css文件单独抽离成一个文件,而不打包在js文件里面
                        options: {
                            publicPath: 'css/',//打包后css所在文件夹的名字
                            chunkFilename: "[id].css" //????
                        }
                    }, { loader: 'css-loader' },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: [
                                // require('postcss-cssnext')(),//已经包含了添加前缀的功能
                                require('autoprefixer')(),//自动添加前缀,浏览器不兼容的样式
                                require('cssnano')() //css压缩
                            ]
                        }
                    }
                ]

            },
            {
                test: /\.(jpg|png|gif|jpeg)$/,//处理html中引用的图片
                use: [

                    {
                        loader: 'img-loader',//图片处理
                        options: {
                            plugins: [
                                require('imagemin-mozjpeg')({
                                    quality: 1, //图片的压缩比例,最大压缩比例,最小压缩比例,范围是0-100
                                    smooth: 7 //平滑度
                                })
                            ],
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: ['img:src']//处理html中,引入式图片,html编译后会自动关联图片
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: './img',
                            publichPath: '../img/',
                            esModule: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ //抽离的css为单独文件
            filename: "css/[name].css" //打包后样式的名字
        }),
        new WebpackDeepScopeAnalysisPlugin(),//深度清理,在****生产环境下***,剔除掉无用的js文件,或者js文件中无用的js代码
        new CleanWebpackPlugin(),//每次打包后,清除之前的打包过的文件
        new PurifyCssPlugin({
            minimize: true,//开启css代码压缩
            paths: glob.sync([
                path.join(__dirname, './src/*.html'),//如果css中的样式如果没有用到,剔除css文件中的该样式,html结构里面如果有注释的元素也还是会被匹配到的,无法剔除css样式,src下面所有的html文件都会被影响到
                path.join(__dirname, './src/*.js')]//在js里面添加的元素,元素用到样式,css文件中也会保留,js动态添加类名,css样式中也会保留,src文件夹下所有的js文件都会被影响到
            )
        }),
        new HtmlWebpackPlugin({//打包html的插件
            filename: 'index.html',
            template: 'html-withimg-loader!' + path.resolve(__dirname, './src/index.html')  //打包html文件使用的模板
        }),

    ],
    mode: 'development'
}
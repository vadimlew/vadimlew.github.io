const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBeforeBuildPlugin = require('before-build-webpack');
const zipper = require('zip-local');

const workFolderPath = process.env.INIT_CWD;
const assetsFolderPath = path.resolve( process.env.INIT_CWD,  'assets' );
const assetsZipPath = path.resolve( process.env.INIT_CWD, 'assets', 'assets.zip' );

const opts = {encoding: 'utf8', flag: 'r'};
const parametersScript = '<script>' + fs.readFileSync( path.resolve(workFolderPath, 'parameters.js'), opts) + '</script>';

module.exports = {
    mode: 'development',
    stats: 'minimal',

    entry: path.resolve(workFolderPath, 'main.mjs'),

    output: {
        path: path.resolve(workFolderPath, 'dist', 'development'),
        clean: true,
        filename: 'main.js',
    },

    resolve: {
        alias: {
            Platform: '#cation/platforms/CommonPlatform.mjs'
        }
    },    

    module: {
        rules: [
            {
                test: /\.(zip)$/i,
                type: 'asset/inline'
            },
        ]
    },

    devServer: {       
        open: true
    },

    watchOptions: {
        ignored: /\.(zip)$/i,
    },

    plugins: [       
        new WebpackBeforeBuildPlugin(function (stats, callback) {
            try {fs.unlinkSync(assetsZipPath)} catch(err){};
            zipper.sync.zip(assetsFolderPath).compress().save(assetsZipPath);
            callback(); 
        }), 

        new HtmlWebpackPlugin({
            filename: path.resolve(workFolderPath, 'dist', 'development', 'index.html'),
            template: path.resolve(__dirname, '..', 'configs', 'html', 'index.html'),
            inject: false,
            scriptLoading: 'module',
            parametersScript: parametersScript
        })
    ]
}
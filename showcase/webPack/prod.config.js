const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBeforeBuildPlugin = require('before-build-webpack');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const zipper = require('zip-local');

const workFolderPath = process.env.INIT_CWD;
const folderName = process.env.INIT_CWD.split("\\").pop();
const assetsFolderPath = path.resolve( process.env.INIT_CWD,  'assets' );
const assetsZipPath = path.resolve( process.env.INIT_CWD, 'assets', 'assets.zip' );

const opts = {encoding: 'utf8', flag: 'r'};
const parametersScript = '<script>' + fs.readFileSync( path.resolve(workFolderPath, 'parameters.js'), opts) + '</script>';

module.exports = {
    mode: 'production',
    stats: 'minimal',    

    entry: path.resolve(workFolderPath, 'main.mjs'),

    output: {
        path: path.resolve(workFolderPath, 'dist', 'production'),
        clean: true,
        filename: 'main.js',
    },

    resolve: {
        alias: {
            Platform: '#cation/platforms/commonPlatform.mjs'
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

    plugins: [
        new WebpackBeforeBuildPlugin(function (stats, callback) {
            try {fs.unlinkSync(assetsZipPath)} catch(err){};
            zipper.sync.zip(assetsFolderPath).compress().save(assetsZipPath);
            callback(); 
        }), 

        // preview
        new HtmlWebpackPlugin({
            filename: path.resolve(workFolderPath, 'dist', 'production', 'preview', `${folderName}-preview.html`),
            template: path.resolve(__dirname, '..', 'configs', 'html', 'index.html'),
            inject: false,
            minify: false,
            scriptLoading: 'module',
            parametersScript: parametersScript
        }),

        // unity
        new HtmlWebpackPlugin({
            filename: path.resolve(workFolderPath, 'dist', 'production', 'unity', `${folderName}-unity.html`),
            template: path.resolve(__dirname, '..', 'configs', 'html', 'index.html'),
            inject: false,
            minify: false,
            scriptLoading: 'module',
            parametersScript: parametersScript
        }),
        
        new HtmlInlineScriptPlugin()        
    ]
}
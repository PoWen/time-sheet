'use strict';

/* global window */

var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function (path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

// 先設定 baseUrl
// load config 時才不會有 no timestamp 錯誤
// 雖然還是可以執行的樣子
require.config({
    baseUrl: '/base',
});

require(['public/requirejs-config'], function (config) {
    // 取得程式的 config ，再根據 test 的需要做修改

    config.baseUrl = '/base';

    // 為了讀取 /tests 下的檔案，karma.config.js 中
    // 把 basePath 設定到 project root
    // 所以把所有 path 前加上 public/
    var name;
    for (name in config.paths) {
        config.paths[name] = 'public/' + config.paths[name];
    }

    require.config(config);

    // 設定完成，載入所有 test ，啟動 karma
    require(allTestFiles, function () {
        window.__karma__.start();
    });
});
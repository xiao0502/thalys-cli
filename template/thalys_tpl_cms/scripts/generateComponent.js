/*
 * @Author: 肖锦
 * @Date: 2021-06-08 13:44:02
 * @LastEditTime: 2021-10-18 10:50:35
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
// 模板生成
const path = require('path');
const fs = require('fs');
const resolve = (...file) => path.resolve(__dirname, ...file);
const log = message => console.log(`${message}`);
const successLog = message => console.log(`${message}`);
const errorLog = error => console.log(`${error}`);
const { vueTemplate } = require('./template');

log('请输入要生成组件路径');

const generateFile = (path, data) => {
    let _data = data;
    if (fs.existsSync(path)) {
        errorLog(`${path}文件已存在`);
        return;
    }

    return new Promise((resolve, reject) => {
        fs.writeFile(path, _data, 'utf8', err => {
            if (err) {
                errorLog(err.message);
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

process.stdin.on('data', async chunk => {
    const inputValue = String(chunk).trim().toString();
    const _args = inputValue.split('/');
    const directoryName = _args[0];
    const componentName = _args[1] || 'index';

    // 组件目录路径
    const componentDirectory = resolve(`../src/view`, `${directoryName}`);
    // vue组件路径
    const componentVueName = resolve(componentDirectory, `${componentName}.vue`);
    const hasComponentDirectory = fs.existsSync(componentDirectory);

    if (!hasComponentDirectory) {
        log(`正在生成component目录${componentDirectory}`);
        await dotExistDirectoryCreate(componentDirectory);
    }

    try {
        log(`正在生成vue文件${componentVueName}`);
        await generateFile(componentVueName, vueTemplate(`${directoryName}`));
        successLog('生成成功');
    } catch (e) {
        errorLog(e.message);
    }

    process.stdin.emit('end');
});

process.stdin.on('end', () => {
    log('exit');
    process.exit();
});

function dotExistDirectoryCreate(directory) {
    return new Promise(resolve => {
        mkdirs(directory, function () {
            resolve(true);
        });
    });
}

// 递归创建目录
function mkdirs(directory, callback) {
    var exists = fs.existsSync(directory);
    if (exists) {
        callback();
    } else {
        mkdirs(path.dirname(directory), function () {
            fs.mkdirSync(directory);
            callback();
        });
    }
}

// 模板生成
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const resolve = (...file) => path.resolve(__dirname, ...file);
const log = message => console.log(chalk.green(`${message}`));
const successLog = message => console.log(chalk.blue(`${message}`));
const errorLog = error => console.log(chalk.red(`${error}`));
const { vueTemplate, routeTemplate } = require('./template');

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
    const mainName = _args[1];
    const componentName = _args[2] || 'index';
    const compoenntDirArr = ['components', 'pages'];

    // 组件目录路径
    const componentDirectory = resolve(`../src`, `${directoryName}/${mainName}`);
    // vue组件路径
    const componentVueName = resolve(componentDirectory, `${componentName}.vue`);
    const routeFileName = resolve(componentDirectory, `route.js`);

    const hasComponentDirectory = fs.existsSync(componentDirectory);

    if (hasComponentDirectory) {
        // errorLog(`${mainName}组件目录已存在，请重新输入`);
        // return;
        if (compoenntDirArr.indexOf(directoryName) === -1) {
            errorLog('请输入正确的组件路径');
            return;
        }
    } else {
        log(`正在生成component目录${componentDirectory}`);
        await dotExistDirectoryCreate(componentDirectory);
    }

    try {
        log(`正在生成vue文件${componentVueName}`);
        await generateFile(
            componentVueName,
            vueTemplate(
                directoryName === 'components' ? `${mainName}` : `${directoryName}-${mainName}-${componentName}`
            )
        );
        // log(`正在生成route文件`)
        // await generateFile(routeFileName, routeTemplate(inputValue));
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
    let exists = fs.existsSync(directory);
    if (exists) {
        callback();
    } else {
        mkdirs(path.dirname(directory), function () {
            fs.mkdirSync(directory);
            callback();
        });
    }
}

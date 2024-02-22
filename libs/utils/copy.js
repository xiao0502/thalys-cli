/*
 * @Author: 肖锦
 * @Date: 2021-01-20 13:51:42
 * @LastEditTime: 2021-10-18 10:50:06
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
const ora = require('ora');
const spinner = ora('🚀 正在拷贝模板...');
const path = require('path');

const fs = require('fs-extra');
async function copy(targetDir, modulePath) {
    spinner.start();
    try {
        fs.ensureDirSync(targetDir);

        fs.copySync(modulePath, targetDir, {
            filter: (src, dest) => {
                return src != path.resolve(modulePath, 'node_modules');
            }
        });
        setTimeout(() => {
            console.log('拷贝模板成功！');
        });
    } catch (err) {
        const { message = '初始化模板失败' } = err;
        spinner.fail(message);
        process.exit();
    }
    spinner.succeed();
}

module.exports = { copy };

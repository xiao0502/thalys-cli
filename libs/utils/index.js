/*
 * @Author: 肖锦
 * @Date: 2021-01-20 14:05:48
 * @LastEditTime: 2021-10-18 10:50:07
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const CWD = process.cwd();
const { prompt } = require('enquirer');

async function targetDirOperate(projectName) {
    const inCurrent = projectName === '.';
    const targetDir = path.resolve(CWD, projectName);
    if (!inCurrent && fs.existsSync(targetDir)) {
        const { action } = await prompt([
            {
                name: 'action',
                type: 'select',
                message: `${chalk.cyan(targetDir)} 目录已经存在。请选择操作类型:`,
                choices: [
                    { message: '替换', name: 'replace' },
                    { message: '取消', name: 'cancel' }
                ]
            }
        ]);
        switch (action) {
            case 'replace':
                console.log(`\n🗑️ Remove ${chalk.cyan(targetDir)}`);
                await fs.remove(targetDir);
                break;
            case 'cancel':
                process.exit();
        }
    }
}

module.exports = { targetDirOperate };

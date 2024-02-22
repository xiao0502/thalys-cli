/*
 * @Author: 肖锦
 * @Date: 2021-01-20 13:53:03
 * @LastEditTime: 2021-10-18 10:55:32
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const ora = require('ora');
const execa = require('execa');
const { copy } = require('./utils/copy.js');
const CWD = process.cwd();
let targetDir = CWD;

async function getSDKtemplate() {
    // 为sdk项目时读取参数
    let description = await getInput('请输入该仓库的描述');
    let keywords = (await getInput('请输入标签(用空格隔开)')).split(' ').filter(e => e) || [];
    let author = await getInput('请输入作者名称');
    return { description, keywords: keywords, author };
}

// 获取用户输入信息
async function getInput(message) {
    let { value } = await inquirer.prompt({
        type: 'input',
        name: 'value',
        message: message
    });
    return value || '';
}

/**
 *
 * @param {*} name
 * @param {*} sdkParams
 * @param {*} temp
 */
async function initSdkTemplate(name, sdkParams, temp) {
    sdkParams.projectName = name;
    const spinner = ora('⚡️ 正在初始化项目...');
    spinner.start();
    spinner.succeed();
    targetDir = path.resolve(CWD, name);
    temDir = path.resolve(CWD, temp.path);
    await copy(targetDir, temDir);
}

async function run(command, args) {
    if (!args) {
        [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: targetDir });
}

module.exports = {
    getSDKtemplate,
    initSdkTemplate
};

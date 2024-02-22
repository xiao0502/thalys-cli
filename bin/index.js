#! /usr/bin/env node
// 指定用node执行脚本
// 命令行执行补全解决方案
const program = require('commander');
program
    .version(require('../package').version) // 版本
    .description('frontend cli version') // 描述
    .usage('<command> [options]'); // 用法

program
    .command('create <project-name>') // thalys create demo
    .description('初始化项目')
    .action(async (name, cmd) => {
        const options = cleanArgs(cmd);
        require('../libs/create')(name, options);
    });

program.parse(process.argv);

function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}
/**
 * 参数的格式化插件
 * @param cmd 当前命令行中的命令数据
 */
function cleanArgs(cmd) {
    const args = {};
    cmd.options.forEach(o => {
        const key = camelize(o.long.replace(/^--/, ''));
        if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key];
        }
    });
    return args;
}

const inquirer = require('inquirer');
async function getTemplate() {
    let list = require('../data.json');
    let types = list.map(item => `${item.name}  ${item.description}`);
    let message = '根据项目选择模板类型';
    let { type } = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message,
        choices: types
    });
    let repo = list[types.indexOf(type)];
    return repo;
}

module.exports = {
    getTemplate
};

/*
 * @Author: 肖锦
 * @Date: 2021-01-20 14:00:33
 * @LastEditTime: 2021-10-18 10:50:02
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
const { targetDirOperate } = require('./utils');
const { getTemplate } = require('./template');
const { getSDKtemplate, initSdkTemplate } = require('./sdkTemplate');

module.exports = async name => {
    await targetDirOperate(name); // 检查是否存在相同目录
    const temp = await getTemplate(); // 获取模板
    let sdkParams = await getSDKtemplate(); // 获取交互参数
    await initSdkTemplate(name, sdkParams || {}, temp); // 初始化模板
};

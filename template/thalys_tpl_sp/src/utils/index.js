/**
 * 格式化用户姓名
 * @param {姓名} name
 */
function formatName(name) {
    let newStr;
    if (name.length === 2) {
        newStr = name.substr(0, 1) + '*';
    } else if (name.length > 2) {
        let char = '';
        for (let i = 0, len = name.length - 1; i < len; i++) {
            char += '*';
        }
        newStr = name.substr(0, 1) + char;
    } else {
        newStr = name;
    }
    return newStr;
}

/**
 * 获取未来N天的日期和星期
 * day_count 未来是多少天
 *
 */
function getDays(day_count) {
    let date = new Date();
    let dates = [];
    let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    for (let i = 0; i <= day_count; i++) {
        let d = null;
        (' ');
        let date1 = date.getDate();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        if (date1 < 10) {
            date1 = '0' + date1;
        }
        d = date.getFullYear() + '-' + month + '-' + date1;
        let weeks = '';
        let day = new Date(d);
        let z = day.getDay();
        weeks = week[z];
        dates.push({
            date: d,
            week: weeks
        });
        date.setDate(date.getDate() + 1);
    }
    return dates;
}

/**
 * 通过出生年月日获取周岁
 * @param {出生年月日} strBirthday
 */
function jsGetAge(strBirthday) {
    let returnAge;
    let strBirthdayArr = strBirthday.split('-');
    let birthYear = strBirthdayArr[0];
    let birthMonth = strBirthdayArr[1];
    let birthDay = strBirthdayArr[2];

    let d = new Date();
    let nowYear = d.getFullYear();
    let nowMonth = d.getMonth() + 1;
    let nowDay = d.getDate();

    let _diffYear = Number(nowYear) - Number(birthYear);
    let _diffMonth = Number(nowMonth) - Number(birthMonth);
    let _diffDay = Number(nowDay) - Number(birthDay);

    if (_diffYear === 0) {
        if (_diffMonth === 0 && _diffDay < 0) {
            returnAge = null; // 返回null 表示出生日期输入错误 晚于今天
        } else if ((_diffMonth === 0 && _diffDay >= 0) || (_diffMonth === 1 && _diffDay < 0)) {
            // 不满一月的按未满月展示
            returnAge = '未满月';
        } else {
            // 不满一年按月展示
            returnAge = `${_diffDay >= 0 ? _diffMonth : _diffMonth - 1}个月`;
        }
    } else {
        if (_diffYear === 1 && _diffMonth <= 0 && _diffDay !== 0) {
            let _less = 12 - Number(birthMonth) + Number(nowMonth);

            _less = _diffDay >= 0 ? _less : _less - 1;
            returnAge = _less === 12 ? '1岁' : `${_less}个月`;
        } else {
            let _diff =
                _diffMonth === 0
                    ? _diffDay >= 0
                        ? _diffYear
                        : _diffYear - 1
                    : _diffMonth > 0
                    ? _diffYear
                    : _diffYear - 1;

            returnAge = `${_diff}岁`;
        }
    }

    return returnAge; // 返回周岁年龄
}

/**
 * 手机号码带星
 * @param {手机号码} phone
 */
function widthStarToPhone(phone) {
    if (!phone || phone.length !== 11) {
        return '';
    }
    return phone.substr(0, 3) + '****' + phone.substr(7);
}

/**
 * 证件号码带星
 * @param {证件号码} certificate
 */
function widthStarToCertificate(certificate, flag) {
    if (!certificate) return '';
    let star = '';

    if (flag) {
        let _arr = certificate.split('');

        _arr.map((item, index) => {
            if (index <= 2 || index >= _arr.length - 4) {
                star += item;
            } else {
                star += '*';
            }
        });
        return star;
    } else {
        certificate.split('').forEach(index => {
            if (index > 2) {
                star += '*';
            }
        });

        return certificate.substr(0, 3) + star;
    }
}

/**
 * 计算在线 状态
 * [account,clientType,custom:{1:{net_state:1,online_state:0}},idClient,idServer,serverConfig,time,type,value]
 */
function updateMultiPortStatus(data) {
    if (data.account) {
        let multiPortStatus = '';

        function getMultiPortStatus(customType, custom) {
            // 服务器下推多端事件标记的特定序号对应值
            let netState = {
                0: '',
                1: 'Wifi',
                2: 'WWAN',
                3: '2G',
                4: '3G',
                5: '4G'
            };
            let onlineState = {
                0: '在线',
                1: '忙碌',
                2: '离开'
            };

            var custom = custom || {};
            if (customType !== 0) {
                // 有serverConfig.online属性，已被赋值端名称
                custom = custom[customType];
            } else if (custom[4]) {
                custom = custom[4];
                multiPortStatus = '电脑';
            } else if (custom[2]) {
                custom = custom[2];
                multiPortStatus = 'iOS';
            } else if (custom[1]) {
                custom = custom[1];
                multiPortStatus = 'Android';
            } else if (custom[16]) {
                custom = custom[16];
                multiPortStatus = 'Web';
            } else if (custom[64]) {
                custom = custom[64];
                multiPortStatus = 'Mac';
            }

            if (custom) {
                custom = JSON.parse(custom);
                if (typeof custom['net_state'] === 'number') {
                    let tempNetState = netState[custom['net_state']];
                    if (tempNetState) {
                        multiPortStatus += '[' + tempNetState + ']';
                    }
                }
                if (typeof custom['online_state'] === 'number') {
                    multiPortStatus += onlineState[custom['online_state']];
                } else {
                    multiPortStatus += '在线';
                }
            }

            return multiPortStatus;
        }
        // demo自定义多端登录同步事件
        if (Number(data.type) === 1) {
            if (
                Number(data.value) === 1 ||
                Number(data.value) === 2 ||
                Number(data.value) === 3 ||
                Number(data.value) === 10001
            ) {
                let serverConfig = JSON.parse(data.serverConfig);
                let customType = 0;
                multiPortStatus = '';
                // 优先判断serverConfig字段
                if (serverConfig.online) {
                    if (serverConfig.online.indexOf(4) >= 0) {
                        multiPortStatus = '电脑';
                        customType = 4;
                    } else if (serverConfig.online.indexOf(2) >= 0) {
                        multiPortStatus = 'iOS';
                        customType = 2;
                    } else if (serverConfig.online.indexOf(1) >= 0) {
                        multiPortStatus = 'Android';
                        customType = 1;
                    } else if (serverConfig.online.indexOf(16) >= 0) {
                        multiPortStatus = 'Web';
                        customType = 16;
                    } else if (serverConfig.online.indexOf(64) >= 0) {
                        multiPortStatus = 'Mac';
                        customType = 64;
                    }
                }
                if (data.custom && Object.keys(data.custom).length > 0) {
                    let portStatus = getMultiPortStatus(customType, data.custom);
                    // 如果serverConfig里有属性而custom里没有对应属性值
                    if (multiPortStatus !== '' && portStatus === '') {
                        multiPortStatus += '在线';
                    } else {
                        multiPortStatus = portStatus;
                        // multiPortStatus += portStatus
                    }
                } else if (customType !== 0) {
                    multiPortStatus += '在线';
                } else {
                    multiPortStatus = '离线';
                }
                return multiPortStatus;
            }
        }
    }

    return '离线';
}
/**
 * 价格处理，去掉小数点后多余的0，如果小数点后全是0，去掉小数点
 * @param price 价格
 */
function priceFormat(price) {
    let __price = Number(price).toFixed(2);
    if (__price.indexOf('.') > 0) {
        __price = __price.replace(/0+?$/g, '');
        __price = __price.replace(/[.]$/g, '');
    }
    return __price;
}

/**
 * 检查是否是函数并且执行
 * @param {函数} fn
 */
const checkFunctionCall = fn => {
    if (fn && typeof fn === 'function') {
        fn();
        return;
    }
};

/**
 * 转化城市id
 * @param {城市id} codeNum
 */
const codeToCityId = codeNum => {
    let code = `${codeNum}`;
    if (code.length === 6) {
        return code.substr(0, 4) + '00';
    } else {
        return '';
    }
};

/**
 * 转化省份id
 * @param {省份id} codeNum
 */
const codeToProId = codeNum => {
    let code = `${codeNum}`;
    if (code.length === 6) {
        return code.substr(0, 2) + '0000';
    } else {
        return '';
    }
};

/**
 * 解析身份证号返回生日、年龄、性别
 * @param {身份证号} IDCardNo
 */
const analysisIDCard = (IDCardNo = '') => {
    let birthday;
    let sex;
    let age;
    let sexName;
    let myDate = new Date();
    let month = myDate.getMonth() + 1;
    let day = myDate.getDate();
    let year = myDate.getFullYear();
    if (IDCardNo.length === 18) {
        // 新身份证
        // 获取出生日期
        birthday = IDCardNo.substring(6, 10) + '-' + IDCardNo.substring(10, 12) + '-' + IDCardNo.substring(12, 14);
        // 获取性别
        sexName = parseInt(IDCardNo.substr(16, 1)) % 2 ? '男' : '女';
        sex = parseInt(IDCardNo.substr(16, 1)) % 2 ? 1 : 2;
        // 获取年龄
        age = year - IDCardNo.substring(6, 10) - 1;
        if (
            IDCardNo.substring(10, 12) < month ||
            (IDCardNo.substring(10, 12) == month && IDCardNo.substring(12, 14) <= day)
        ) {
            age++;
        }
    } else {
        // 旧身份证
        // 获取出生日期
        let temp = IDCardNo.substring(6, 12);
        temp = '19' + temp;
        birthday = temp.substring(0, 4) + '-' + temp.substring(4, 6) + '-' + temp.substring(6);
        // 获取性别
        sexName = parseInt(IDCardNo.substr(14, 1)) % 2 ? '男' : '女';
        sex = parseInt(IDCardNo.substr(14, 1)) % 2 ? 1 : 2;
        // 获取年龄
        age = year - temp.substring(0, 4) - 1;
        if (temp.substring(4, 6) < month || (temp.substring(4, 6) == month && temp.substring(6) <= day)) {
            age++;
        }
    }
    return {
        birthday,
        sex,
        sexName,
        age
    };
};

const isMobile = value => {
    return /^1[3456789]\d{9}$/.test(value);
};

/**
 * 深度比较两个对象是否相等
 * @type {{compare: compareObj.compare, isObject: (function(*=): boolean), isArray: (function(*=): boolean)}}
 */
const compareObj = {
    // 比较两个对象是否相等
    compare: function (oldData, newData) {
        // 类型为基本类型时,如果相同,则返回true
        if (oldData === newData) return true;
        if (
            compareObj.isObject(oldData) &&
            compareObj.isObject(newData) &&
            Object.keys(oldData).length === Object.keys(newData).length
        ) {
            // 类型为对象并且元素个数相同
            // 遍历所有对象中所有属性,判断元素是否相同
            for (const key in oldData) {
                if (oldData.hasOwnProperty(key)) {
                    if (!compareObj.compare(oldData[key], newData[key])) {
                        // 对象中具有不相同属性 返回false
                        return false;
                    }
                }
            }
        } else if (compareObj.isArray(oldData) && compareObj.isArray(oldData) && oldData.length === newData.length) {
            // 类型为数组并且数组长度相同
            for (let i = 0, length = oldData.length; i < length; i++) {
                if (!compareObj.compare(oldData[i], newData[i])) {
                    // 如果数组元素中具有不相同元素,返回false
                    return false;
                }
            }
        } else {
            // 其它类型,均返回false
            return false;
        }
        // 走到这里,说明数组或者对象中所有元素都相同,返回true
        return true;
    },
    // 判断此类型是否是Array类型
    isObject: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    },
    // 判断此对象是否是Object类型
    isArray: function (arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    }
};

/**
 * @description: 计算指定日期与现在相差多少个月
 * @param {number} compareYear 年
 * @param {number} compareMonth 月
 * @param {number} compareDay 日
 * @return: 相差的月数
 */

const getDistanceMonth = (compareYear, compareMonth, compareDay) => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let yearToMonth = (compareYear - year) * 12;
    let monthToMonth = compareMonth - month;
    let dateToMonth = 0;

    if (monthToMonth > 0) {
        dateToMonth = compareDay <= day ? -1 : 0;
    } else if (monthToMonth < 0) {
        dateToMonth = compareDay > day ? 1 : 0;
    } else {
        dateToMonth = compareDay > day ? 1 : 0;
    }

    return yearToMonth + monthToMonth + dateToMonth;
};

export {
    formatName,
    getDays,
    jsGetAge,
    widthStarToPhone,
    widthStarToCertificate,
    updateMultiPortStatus,
    priceFormat,
    checkFunctionCall,
    codeToCityId,
    codeToProId,
    analysisIDCard,
    isMobile,
    compareObj,
    getDistanceMonth
};

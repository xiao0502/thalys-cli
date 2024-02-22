/*
 * @Author: 肖锦
 * @Date: 2021-06-04 09:24:03
 * @LastEditTime: 2021-06-04 10:52:08
 * @Description: file content
 * @LastEditors: 肖锦
 */
import HttpRequest from '@/libs/axios';
import { environmentConfig } from '@/libs/tools';

const baseUrl = environmentConfig('baseUrl');

const axios = new HttpRequest(baseUrl);
export default axios;

import Vue from 'vue';

import { http } from '../utils/http';
import { getValueByUrlParams, setTopTitle, getNowTime } from '../utils/common';

Vue.prototype.$http = http
Vue.prototype.$getValueByUrlParams = getValueByUrlParams
Vue.prototype.$setTopTitle = setTopTitle
Vue.prototype.$getNowTime = getNowTime
// 静态图片前缀
// Vue.prototype.$imgUrl = "https://oss.xingyaozhibo.com";
Vue.prototype.$imgUrl = "https://h5.xingyaozhibo.com";
Vue.prototype.$checkHttp = (url) => {
	if (url.includes("http")) {
		return url;
	} else {
		return Vue.prototype.$imgUrl + url;
	}
};

// 测试
// Vue.prototype.$baseURL = 'https://test.xingyaozhibo.com/api/'
// 正式
Vue.prototype.$baseURL = 'https://ht.xingyaozhibo.com/api/'

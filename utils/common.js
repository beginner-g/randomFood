// 获取链接上携带的参数
export function getValueByUrlParams (paras) {
	let url = window.location.href;
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
	var paraObj = {}
	var i, j
	for (i = 0; j = paraString[i]; i++) {
		paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j
			.length);
	}
	var returnValue = paraObj[paras.toLowerCase()];
	if (typeof(returnValue) == "undefined") {
		return "";
	} else {
		return returnValue;
	}
};
export function setTopTitle(title) {
     postStatus.postMessage(JSON.stringify({'order' : 'title', 'topTile': title}));
}
export function getNowTime () {
	let now = new Date();
	let year = now.getFullYear(); //获取完整的年份(4位,1970-????)
	let month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
	let today = now.getDate(); //获取当前日(1-31)
	let hour = now.getHours(); //获取当前小时数(0-23)
	let minute = now.getMinutes(); //获取当前分钟数(0-59)
	let second = now.getSeconds(); //获取当前秒数(0-59)
	let nowTime = ''
	nowTime = year + '-' + fillZero(month) + '-' + fillZero(today) + ' ' + fillZero(hour) + ':' +
	  fillZero(minute) + ':' + fillZero(second)
	return nowTime
};
      
function fillZero (str) {
	var realNum;
	if (str < 10) {
	realNum = '0' + str;
	} else {
	realNum = str;
	}
	return realNum;
}
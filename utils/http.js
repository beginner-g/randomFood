export function http ({
	url,
	method = 'get',
	data = {},
	success,
	error
}) {
	uni.request({
		url: this.$baseURL + url,
		header: {
			// 'Access-Control-Allow-Origin': '*',
			'token': uni.getStorageSync('token') || '',
			// 测试
			// 'token': 'f1bd90c6-6dbb-4c07-b04b-821ca87703d8',
			// 正式
			// 'token': '408f9830-7a84-4cb1-bfb4-daa5c61c3de7'
		},
		data,
		method,
		complete: (res) => {
			if (res.errMsg == 'request:ok' && typeof(res.data) == 'object') {
				if (res.data.code == 401) {

					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					})
				} else if (res.data.code == 1) {
					if (success) {
						success(res.data.data || res.data)
					}
				} else if (res.data.code != 1 && error) { //有失败回调
					error(res)
				} else if (res.data.code != 1 && !error) {
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					})
				}
			} else {
				console.log('请求超时，请检查网络')
				uni.hideLoading()
				uni.showToast({
					title: '请求超时，请检查网络！',
					icon: 'none'
				})
			}
		}
	});
}
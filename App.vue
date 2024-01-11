<script>
	export default {
		onLaunch: function() {
			console.warn(window.location)
			let getcurtoken = this.$getValueByUrlParams("token");
			let getUsername = this.$getValueByUrlParams("username");
			let getMoney = this.$getValueByUrlParams("price");
			console.warn(getcurtoken)
			if (getcurtoken) {
				uni.setStorageSync('token', getcurtoken)
				uni.setStorageSync('username', getUsername)
				uni.setStorageSync('price', getMoney)
			} else {
				uni.setStorageSync('token', '')
				uni.setStorageSync('username', '')
				uni.setStorageSync('price', '')
			}
			console.log('App Launch')
		},
		onShow: function(options) {
			console.log('App Show', options)
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	page {
		// background: rgb(0,21,51);
		width: 100%;
		height: 100%;
	}
</style>
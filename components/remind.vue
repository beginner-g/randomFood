<template>
	<uni-popup ref="popup">
	  <view class="popup">
	    
	  </view>
	</uni-popup>
</template>

<script>
	export default {
		name:"remind",
		data() {
			return {
				
			};
		},
		onLoad: function() {
			this.show()
		},
		show: function() {
			this.$refs['popup'].open()
		},
		hide: function() {
			this.$refs['popup'].close()
		}
	}
</script>

<style lang="less">
	.popup {
		background: url('../static/remind/编组 9@2x (1).png');
		background-size: 100%;
		width: 520rpx;
		height: 367rpx;
	}
</style>
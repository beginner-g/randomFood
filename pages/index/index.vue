<template>
	<scroll-view scroll-y="true" style="height: 100%;">
		<view class="shadow" @click="goBack"></view>
		<view class="wrap" @click.stop>
			<view class="noice">
				<view class="noice-box" v-if="notice.length">
					<view class='tongzhitext' :hidden="hideNotice">
						<text class="">{{noticeJson.nickname}}</text>
						<text class="tongzhi-text">{{noticeJson.ret}}</text>
						<text>x{{noticeJson.prize_count}}</text>
					</view>
				</view>
			</view>
			<!-- 转盘 -->
			<view class="zhuanpan-wrap">
				<view class="prizeWrap" :style="prizeWrapStyle">
					
				</view>
				<view class="luck-wrap" :style="prizeWrapStyle">
					<view class="luck-item" v-for="(item, index) in giftArr" :key="index" :style="prizeStyle(index)">
						<text class="luck-item-name">{{item.gift_name}}</text>
					</view>
				</view>
				<image src="../../static/select.png" mode="" class="activeShow" v-if="active"></image>
				<image src="../../static/arrow.png" mode="" class="arrow"></image>
			</view>
			<view class="btn">
				<view class="btn-wrap checkActive" @click="luckFunc">
					<text style="font-size: 28rpx;font-weight: 500;">抽奖</text>
				</view>
			</view>
			<!-- 中奖 -->
			<uni-popup ref="luck-popup" :maskClick="false">
				<view class="luck-popup" :style="{'padding-top': prize_list.length > 3 ? '20rpx' : '20rpx'}">
					<view class="luck-list" :style="{'justifyContent': prize_list.length > 3 ? 'flex-start' : 'center'}">
						<view class="luck-item" v-for="(item, index) in prize_list" :key="index">
							<text>{{item.gift_name}}</text>
						</view>
					</view>
					<view class="luck-btn">
						<image src="../../static/result/btn.png" mode="" @click="cancelLuck" class="checkActive"></image>
					</view>
				</view>
			</uni-popup>
		</view>
	</scroll-view>
</template>

<script>
	import { nextTick } from "vue"
	import morePopup from '@/components/more-popup/more-popup.vue'
	let timerNotice = null
	let timer = null
	export default {
		components: {
			morePopup
		},
		data() {
			return {
				notice: [],
				hideNotice: true,
				noticeJson: {},
				luck: false,
				active: false,
				rafflePrice: 0, // 消耗游戏币
				baseRunAngle: 360 * 2, // 总共转动角度 至少5圈
				rotateAngle: 45, // 每个奖品的角度
				totalRunAngle: 0,
				prizeWrapStyle: {},
				showRemind: false,
				remind: true,
				giftArr: [],
				prizeId: 0, // 抽中的最大奖的索引
				huanlexing: 0,
				prizeValue: 0, // 当前大奖进度
				prizeValueAll: 2500, // 大奖总进度
				progressWidth: 0,
				dajiangParams: {}, // 大奖数据
				prize_list: [],
			}
		},
		computed: {
			prizeStyle() {
				return (i) => {
					return `
						width: 60px;
						height: 350rpx;
						transform: rotate(${this.rotateAngle * i + this.rotateAngle / 2}deg);
						transform-origin: 50% 100%;
					`
				  }
			}
		},
		onLoad() {
		},
		onShow() {
			this.getData()
		},
		onUnload() {
			clearInterval(timerNotice)
		},
		methods: {
			// 获取礼物
			getData: function() {
				this.giftArr = [
					{
						gift_name: '兰州'
					},
					{
						gift_name: '板面'
					},
					{
						gift_name: '黄焖鸡'
					},
					{
						gift_name: '汉堡'
					},
					{
						gift_name: '沙县'
					},
					{
						gift_name: '麻辣烫'
					},
					{
						gift_name: '大食堂'
					},
					{
						gift_name: '嘉禾一粥'
					},
				]
				this.giftArr.map((t, i) => {
					t.rotateAngle = this.rotateAngle * i + this.rotateAngle
				})
			},
			// 抽奖
			luckFunc: function() {
				if (!this.luck) {
					this.luck = true
					this.ajaxFunc()
				}
			},
			ajaxFunc: function() {
				let that = this
				that.prize_list = []
				that.prizeId = Math.floor(Math.random() * 9)
				that.prize_list.push(that.giftArr[that.prizeId])
				that.totalRunAngle = that.baseRunAngle + 360 - that.prizeId * that.rotateAngle - that.rotateAngle / 2
				that.prizeWrapStyle = {'transform': 'rotate('+that.totalRunAngle+'deg)','transition': 'all 4s ease'};
				that.$nextTick(() => {
					setTimeout(() => {
						that.active = true
						that.$forceUpdate()
						// 中奖弹窗
						setTimeout(() => {
							that.$refs['luck-popup'].open()
						},800)
					},4000)
				})
			},
			cancelLuck: function() {
			  console.log('totalRunAngle', this.totalRunAngle)
			  this.prizeWrapStyle = {'transform': 'rotate('+0+'deg)'};
			  console.log('领完啦', this.totalRunAngle - this.baseRunAngle)
			  // this.giftArr[this.prizeId].active = false
			  this.active = false
			  this.luck = false
			  this.$refs['luck-popup'].close()
			},
		}
	}
</script>

<style lang="less" scoped>
	.shadow {
		width: 100%;
		height: 100%;
		background: transparent !important;
		position: fixed;
		z-index: 50;
	}
	.wrap {
		position: absolute;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: url('../../static/bg.png');
		background-size: 100% 100%;
		width: 750rpx;
		height: 1234rpx;
		z-index: 100;
		.noice {
			width: 558rpx;
			height: 44rpx;
			// background: url('../../static/noice.png');
			background-size: 100% 100%;
			margin-top: 157rpx;
			padding-left: 80rpx;
			box-sizing: border-box;
			.noice-box {
				width: 100%;
				overflow: hidden;
			}
			.tongzhitext {
				display: flex;
				align-items: center;
				// overflow: hidden;
				// white-space: nowrap;
				// text-overflow: ellipsis;
				// animation: remindMessage 10s linear infinite;
				animation:remindMessage 0s infinite linear both;
				animation-duration: 8s;
				animation-iteration-count: infinite;
				font-size: 26rpx;
				width: 558rpx;
				line-height: 24px;
				text {
					color: #fff;
				}
				.tongzhi-text {
					display: block;
					color: #FFEC5F;
				}
			}
		}
		.recharge-wrap {
			width: 100%;
			padding: 20rpx 31rpx 0;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			.recharge {
				display: flex;
				align-items: center;
				justify-content: space-between;
				background-color: #24344D;
				border: 1px solid #3DD0E1;
				border-radius: 14rpx;
				width: 280rpx;
				height: 54rpx;
				padding: 0 2px;
				.huanlexing {
					width: 42rpx;
					height: 42rpx;
				}
				.recharge-text {
					font-size: 26rpx;
					font-weight: 600;
					color: #9DD9FD;
					line-height: 37rpx;
				}
				.add {
					width: 56rpx;
					height: 44rpx;
				}
			}
			.more {
				image {
					width: 129rpx;
					height: 54rpx;
				}
			}
		}
		
		.zhuanpan-wrap {
			margin-top: 80rpx;
			display: flex;
			position: relative;
			.prizeWrap {
				background: url(../../static/luck.png);
				background-size: 100% 100%;
				width: 700rpx;
				height: 685rpx;
				z-index: 10;
			}
			.luck-wrap {
				width: 700rpx;
				height: 685rpx;
				position: absolute;
				z-index: 12;
			}
			.activeShow {
				position: absolute;
				top: 14.5%;
				left: 37.5%;
				width: 254.51rpx;
				height: 180.09rpx;
				transform: rotate(-110deg);
				z-index: 11;
			}
			.arrow {
				width: 164rpx;
				height: 164rpx;
				position: absolute;
				top: 50%;
				left: 50%;
				margin-top: -82rpx;
				margin-left: -82rpx;
				transform: rotate(180deg);
				z-index: 12;
			}
			.luck-item {
				position: absolute;
				left: 0;
				right: 0;
				margin: auto;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				z-index: 12;
				image {
					width: 80rpx;
					height: 80rpx;
					z-index: 20;
				}
				.luck-item-name {
					font-size: 26rpx;
					color: #FFFFFF;
					line-height: 36rpx;
					z-index: 20;
					padding-top: 20rpx;
					box-sizing: border-box;
				}
				.prize-is_audio {
					position: absolute;
					top: 100rpx;
					left: -20rpx;
					width: 48rpx;
					height: 24rpx;
					background: linear-gradient(180deg, #24AFFF 0%, #0050FF 100%);
					font-size: 17rpx;
					color: #fff;	
					text-align: center;
					line-height: 24rpx;
					border-radius: 0 0 14rpx 0;
					// transform: rotate(-20deg);
					z-index: 20;
				}
				.active {
					position: absolute;
					top: 32%;
					left: 50%;
					margin-left: calc(-280rpx / 3);
					width: 254.51rpx;
					height: 180.09rpx;
					transform: rotate(-110deg);
					z-index: 10;
				}
			}
			.tip {
				position: absolute;
				top: 50%;
				left: 50%;
				margin-left: -24px;
				font-size: 28rpx;
				color: #fff;
				text-align: center;
				background: rgba(0,0,0.2);
				width: 100rpx;
				height: 35rpx;
				line-height: 35rpx;
				z-index: 21;
			}
		}
		.dajiang {
			background: url('../../static/dajiang/矩形@2x (2) (1).png');
			background-size: 100% 100%;
			width: 625rpx;
			height: 80rpx;
			display: flex;
			position: relative;
			// margin-top: -15rpx;
			.dajiang-img {
				width: 96rpx;
				height: 96rpx;
				background: #2F3D57;
				margin-top: -30rpx;
				.dajiang-title {
					width: 122.74rpx;
					height: 30.51rpx;
					position: absolute;
					top: -26px;
					left: -6px;
					z-index: 10;
				}
				.dajiang-url {
					width: 96rpx;
					height: 96rpx;
				}
				.dajiang-price {
					background: url('../../static/dajiang/矩形@2x (1).png');
					background-size: 100% 100%;
					width: 143rpx;
					height: 26rpx;
					position: absolute;
					bottom: -4px;
					left: -6px;
					display: flex;
					align-items: center;
					text {
						font-size: 18rpx;
						line-height: 24rpx;
						color: #fff;
						padding-left: 10rpx;
					}
				}
				.prize-is_audio {
					position: absolute;
					top: -20rpx;
					left: 0rpx;
					width: 48rpx;
					height: 24rpx;
					background: linear-gradient(180deg, #24AFFF 0%, #0050FF 100%);
					font-size: 17rpx;
					color: #fff;
					text-align: center;
					line-height: 24rpx;
					border-radius: 0 0 14rpx 0;
					z-index: 20;
				}
			}
			.dajiang-wrap {
				display: flex;
				flex-direction: column;
				flex: 1;
				padding: 10rpx 20rpx;
				box-sizing: border-box;
				.progress_text {
					font-size: 18rpx;
					color: #fff;
					line-height: 18rpx;
				}
				.progress_bar {
					width: 480rpx;
					height: 20rpx;
					background: url('../../static/dajiang/矩形@2x (3) (1).png');
					background-size: 100% 100%;
					margin: 10rpx 0;
					.progress {
						width: 0;
						background: url('../../static/dajiang/矩形@2x (4).png');
						background-size: 100% 100%;
						height: 20rpx;
					}
				}
				.dajiang_text {
					font-size: 18rpx;
					line-height: 18rpx;
					color: #FFF266;
					position: absolute;
					right: 20rpx;
					bottom: 0;
				}
			}
		}
		.btn {
			margin-top: 50rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			.btn-wrap {
				background: #123c64;
				border-radius: 20rpx;
				width: 259rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				border: 1px solid #0ff;
				text {
					color: #FFFFFF;
					line-height: 28rpx;
					font-size: 24rpx;
				}
				&.btn-wrap1 {
					background: url('../../static/bottom/次数@2x (1) (1).png');
					background-size: 100%;
					width: 259rpx;
					height: 126rpx;
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
				}
			}
		}
	}
	.checkActive:active {
		transform:scale(0.92);
		-ms-transform:rotate(0.92); 	/* IE 9 */
		-moz-transform:rotate(0.92); 	/* Firefox */
		-webkit-transform:rotate(0.92); /* Safari 和 Chrome */
		-o-transform:rotate(0.92); 	/* Opera */
	}
	@keyframes remindMessage {
	 0% {
	  -webkit-transform: translateX(90%);
	 }
	 
	 100% {
	  -webkit-transform: translateX(-180%);
	 }
	}
	.remind-popup {
		background: url('../../static/remind/编组 9@2x (1).png');
		background-size: 100%;
		width: 520rpx;
		height: 367rpx;
		display: flex;
		flex-direction: column;
		.remind-title {
			margin-top: 138rpx;
			font-size: 24rpx;
			color: #A1CFE6;
			line-height: 32rpx;
			text-align: center;
		}
		.remind-content {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			margin-left: 62rpx;
			image {
				width: 18rpx;
				height: 18rpx;
			}
			text {
				font-size: 22rpx;
				color: #A1CFE6;
				line-height: 30rpx;
				padding-left: 10rpx;
			}
		}
		.remind-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			image {
				width: 240rpx;
				height: 112rpx;
			}
		}
	}
	.playInstr-popup {
		background: url('../../static/remind/playInstr.png');
		background-size: 100%;
		position: relative;
		width: 520rpx;
		height: 663rpx;
		image {
			position: absolute;
			left: 50%;
			margin-left: -120rpx;
			bottom: 10rpx;
			width: 240rpx;
			height: 112rpx;
		}
	}
	.luck-popup {
		background: url('../../static/result/bg.png');
		background-size: 100%;
		width: 520rpx;
		height: 550rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20rpx 10rpx;
		box-sizing: border-box;
		.luck-list {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			.luck-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 10rpx 12rpx;
				box-sizing: border-box;
				image {
					width: 120rpx;
					height: 120rpx;
					margin-bottom: 20rpx;
				}
				text {
					font-size: 66rpx;
					color: #A1CFE6;
					line-height: 34rpx;
					text-align: center;
				}
				&.luck-item-active {
					border: 1px solid rgb(255, 223, 60);
					padding: 2px;
					box-sizing: border-box;
					border-radius: 2px;
				}
			}
		}
		.luck-btn {
			position: absolute;
			bottom: 20rpx;
			left: 50%;
			margin-left: -120rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			image {
				width: 240rpx;
				height: 112rpx;
			}
			text {
				margin-top: 20rpx;
			}
		}
	}
</style>

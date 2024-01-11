<template>
	<view class="more-popup">
		<view class="nav">
			<image src="../../static/rule/arrow.png" mode="" class="arrow checkActive" @click="closePopup()"></image>
			<image :src="item.active ? item.urlActive : item.url" mode="" v-for="(item,index) in navList" :key="index" class="nav-item checkActive" @click="changeNav(index)"></image>
		</view>
		<!-- 我的记录 -->
		<view class="my-recode rule" v-if="activeInd === 0" id="my-recode">
			<scroll-view scroll-y="true" @scrolltolower="lower()" style="height: 815rpx">
				<view class="myrecode-list" v-if="myRecodeList.length">
					<view class="myrecode-list-item" v-for="(item,index) in myRecodeList" :key="index">
						<view class="item-content" @click="toggle(index)">
							<view class="list-item-content">
								<text class="title">许愿{{ item.count_num}}次</text>
								<text class="time">{{ item.draw_time }}</text>
							</view>
							<image :src="!item.active ? '../../static/rule/arrowRight.png' : '../../static/rule/bottomArrow.png'" mode=""></image>
						</view>
						<view class="item-detail" v-if="item.active">
							<view class="gift" v-for="(item1,index1) in item.list" :key="index1">
								<view class="img">
									<image :src="item1.gifticon_image" mode=""></image>
								</view>
								<text>{{item1.gift_name}}x{{item1.draw_num}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="nodata" v-if="!myRecodeList.length">
					<text>暂无记录</text>
				</view>
			</scroll-view>
		</view>
		<!-- 每周榜单 -->
		<view class="rankWeek rule" v-if="activeInd === 1">
			<scroll-view scroll-y="true" class="scroll-Y" style="height: 815rpx;">
				<view class="rankWeek-list" v-if="rankWeekList.length">
					<view class="rankWeek-list-item" v-for="(item,index) in rankWeekList" :key="index">
						<view class="list-item-left">
							<image src="../../static/rule/1.png" mode="" class="rankImg" v-if="index === 0"></image>
							<image src="../../static/rule/2.png" mode="" class="rankImg" v-if="index === 1"></image>
							<image src="../../static/rule/3.png" mode="" class="rankImg" v-if="index === 2"></image>
							<view class="rank" v-if="index !== 0 && index !== 1 && index !== 2">
								<text>{{ item.rank }}</text>
							</view>
							<image :src="item.avatar" mode="" class="avatar"></image>
							<text class="name">{{ item.nickname }}</text>
						</view>
						<view class="list-item-right">
							<view class="gift" v-for="(item1, index1) in item.gift_list" :key="index1">
								<view class="img">
									<image :src="item1.gifticon_image" mode="widthFix"></image>
								</view>
								<text>x{{ item1.num }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="nodata" v-if="!rankWeekList.length">
					<text>暂无记录</text>
				</view>
			</scroll-view>
		</view>
		<!-- 锦鲤记录 -->
		<view class="bigGift rule" v-if="activeInd === 2">
			<scroll-view scroll-y="true" class="scroll-Y" style="height: 815rpx;">
				<view class="bigGift-list" v-if="bigGiftList.length">
					<view class="bigGift-list-item" v-for="(item,index) in bigGiftList" :key="index">
						<view class="list-item-left">
							<image :src="item.avatar" mode="" class="avatar"></image>
							<view class="item-content">
								<text class="title">{{ item.nickname }}获得锦鲤奖励</text>
								<text class="time">{{ item.create_time}}</text>
							</view>
						</view>
						<view class="list-item-right">
							<image :src="item.gifticon_image" mode=""></image>
						</view>
					</view>
				</view>
				<view class="nodata" v-if="!bigGiftList.length">
					<text>暂无记录</text>
				</view>
			</scroll-view>
		</view>
		<!-- 规则说明 -->
		<view class="gameRule rule" v-if="activeInd === 3">
			<scroll-view scroll-y="true" class="scroll-Y" style="height: 815rpx;">
				<view style="padding: 30rpx;box-sizing: border-box;">
					<image src="../../static/rule/rule.png" mode="widthFix"></image>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import nav1 from '../../static/rule/nav1.png'
	import nav1_ from '../../static/rule/nav1_.png'
	import nav2 from '../../static/rule/nav2.png'
	import nav2_ from '../../static/rule/nav2_.png'
	import nav3 from '../../static/rule/nav3.png'
	import nav3_ from '../../static/rule/nav3_.png'
	import nav4 from '../../static/rule/nav4.png'
	import nav4_ from '../../static/rule/nav4_.png'
	export default {
		data() {
			return {
				navList: [
					{
						url: nav1,
						urlActive: nav1_,
						active: true
					},
					{
						url: nav2,
						urlActive: nav2_,
						active: false
					},
					{
						url: nav3,
						urlActive: nav3_,
						active: false
					},
					{
						url: nav4,
						urlActive: nav4_,
						active: false
					},
				],
				activeInd: 0,
				triggered: false,//下拉刷新是否被触发
				_freshing: false, // 是否正在刷新
				pageNum: 1,
				canloading: false,
				scrollHeight: 880,
				scrollInto: '',
				myRecodeList: [],
				rankWeekList: [],
				bigGiftList: []
			}
		},
		onLoad() {
			this.getMyRecode()
		},
		onShow() {
		},
		computed:{
		},
		methods: {
			changeNav: function(index) {
				this.navList.map(t => {
					t.active = false
				})
				this.navList[index].active = !this.navList[index].active
				this.activeInd = index
				if (this.activeInd === 0) {
					this.myRecodeList = []
					this.initPage()
					this.getMyRecode()
				} else if (this.activeInd === 1) {
					this.myRecodeList = []
					this.getRankWeek()
				} else if (this.activeInd === 2) {
					this.getBigGiftList()
				} else {
					
				}
			},
			// 获取我的记录
			getMyRecode: function() {
				let params = {
					page: this.pageNum || 1,
					pageSize: 8,
					gameId: 5
				}
				this.canloading = false;
				this.$http({
					url: 'game/getMyDrawLog',
					method: 'post',
					data: params,
					success: (res) => {
						if (res) {
							let records = res || []
							if (records.length) {
								// 合并数据
								this.myRecodeList=this.myRecodeList.concat(records)
								this.myRecodeList.map(t => {t.active = false})
								if(records.length<8){
									this.canloading=true
								} else {
									this.canloading=false
								}
							} else {
								this.canloading=true
							}
						} else {
							this.canloading=false
							this.initPage()
						}
					}
				})
			},
			lower() {
				if (!this.canloading) {
					this.canloading = true
					this.pageNum++
					this.getMyRecode()
				}
			},
			// 页码复原
			initPage: function() {
				this.pageNum--;
				if (this.pageNum <= 0) {
					this.pageNum = 0;
				}
			},
			toggle: function(index) {
				this.myRecodeList.map((t, i) => {
					if (index !== i) {
						t.active = false
					}
				})
				this.myRecodeList[index].active = !this.myRecodeList[index].active
				this.$forceUpdate()
				console.log(this.myRecodeList)
			},
			// 获取每周榜单
			getRankWeek: function() {
				this.$http({
					url: 'game/getRankWeek',
					method: 'post',
					data: {
						gameId: 5
					},
					success: (res) => {
						if (res) {
							console.log('res', res)
							this.rankWeekList = res
							this.rankWeekList.map((t, i) => {
								t.rank = (i + 1)
								if (i < 9) {
									t.rank = '0' + t.rank
								}
								if (t.gift_list.length >3) {
									t.gift_list = t.gift_list.slice(0, 3)
								}
							})
						}
					}
				})
			},
			// 获取锦鲤记录
			getBigGiftList: function() {
				this.$http({
					url: 'game/getBigGiftList',
					method: 'post',
					data: {
						gameId: 5
					},
					success: (res) => {
						if (res) {
							console.log('res', res)
							this.bigGiftList = res
						}
					}
				})
			},
			closePopup: function() {
				this.$emit('closePopupProps')
			}
		}
	}
</script>

<style lang="less">
	.checkActive:active {
		transform:scale(0.92);
		-ms-transform:rotate(0.92); 	/* IE 9 */
		-moz-transform:rotate(0.92); 	/* Firefox */
		-webkit-transform:rotate(0.92); /* Safari 和 Chrome */
		-o-transform:rotate(0.92); 	/* Opera */
	}
	.more-popup {
		background-size: 100%;
		width: 100%;
		height: 1000rpx;
		display: flex;
		flex-direction: column;
		.nav {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 25rpx;
			box-sizing: border-box;
			background: url('../../static/rule/navBg.png');
			background-size: 100% 100%;
			width: 100%;
			height: 120rpx;
			.arrow {
				width: 64rpx;
				height: 64rpx;
			}
			.nav-item {
				width: 148rpx;
				height: 64rpx;
			}
		}
		.rule {
			background: #24364E;
			width: 100%;
			height: 100%;
		}
		.my-recode {
			display: flex;
			.myrecode-list {
				width: 100%;
				display: flex;
				flex-direction: column;
				padding: 20rpx 0;
				box-sizing: border-box;
				.myrecode-list-item {
					width: 100%;
					display: flex;
					flex-direction: column;
					.item-content {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 16rpx 30rpx;
						box-sizing: border-box;
						.list-item-content{
							display: flex;
							flex-direction: column;
							.title {
								color: #A1CFE6;
								font-size: 32rpx;
								line-height: 40rpx;
								margin-bottom: 8rpx;
							}
							.time {
								color: #ffffff;
								font-size: 22rpx;
							}
						}
						image {
							width: 24rpx;
							height: 24rpx;
						}
					}
					.item-detail {
						background: rgba(216,216,216,0.1);
						width: 100%;
						display: flex;
						flex-wrap: wrap;
						padding: 15rpx 30rpx;
						box-sizing: border-box;
						.gift {
							width: 50%;
							display: flex;
							align-items: center;
							margin: 10rpx 0;
							.img {
								width: 80rpx;
								height: 80rpx;
								margin-right: 14rpx;
								image {
									width: 100%;
									height: 100%;
								}
							}
							text {
								font-size: 30rpx;
								line-height: 40rpx;
								color: #A1CFE6;
							}
						}
					}
				}
			}
			.loadMore {
				display: flex;
				justify-content: center;
				color: #A1CFE6;
				padding: 20rpx 0;
				box-sizing: border-box;
			}
		}
		.rankWeek {
			display: flex;
			.rankWeek-list {
				display: flex;
				flex-direction: column;
				padding: 20rpx 30rpx;
				box-sizing: border-box;
				.rankWeek-list-item {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20rpx 0;
					box-sizing: border-box;
					.list-item-left {
						display: flex;
						align-items: center;
						.rankImg {
							width: 70rpx;
							height: 44rpx;
						}
						.rank {
							width: 70rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							text {
								font-size: 30rpx;
								color: #A1CFE6;
							}
						}
						.avatar {
							margin: 0 24rpx 0 20rpx;
							box-sizing: border-box;
							width: 80rpx;
							height: 80rpx;
							border-radius: 50%;
						}
						.name {
							font-size: 26rpx;
							color: #FFFFFF;
						}
					}
					.list-item-right {
						display: flex;
						align-items: center;
						flex: 1;
						justify-content: end;
						.gift {
							position: relative;
							margin-right: 30rpx;
							.img {
								width: 70rpx;
								height: 70rpx;
								image {
									width: 100%;
									height: 100%;
								}
							}
							text {
								padding: 2rpx 4rpx;
								box-sizing: border-box;
								border-radius: 13rpx;
								background: #00AAFF;
								position: absolute;
								bottom: -12rpx;
								right: -12rpx;
								color: #ffffff;
								font-size: 18rpx;
							}
						}
					}
				}
			}
		}
		.bigGift {
			display: flex;
			.bigGift-list {
				display: flex;
				flex-direction: column;
				padding: 20rpx 30rpx;
				box-sizing: border-box;
				.bigGift-list-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 20rpx 0;
					box-sizing: border-box;
					.list-item-left {
						display: flex;
						align-items: center;
						.avatar {
							width: 80rpx;
							height: 80rpx;
							border-radius: 50%;
							margin-right: 24rpx;
						}
						.item-content {
							display: flex;
							flex-direction: column;
							.title {
								color: #A1CFE6;
								font-size: 26rpx;
								margin-bottom: 6rpx;
							}
							.time {
								font-size: 22rpx;
								color: #ffffff;
							}
						}
					}
					.list-item-right {
						display: flex;
						justify-content: end;
						image {
							width: 80rpx;
							height: 80rpx;
						}
					}
				}
			}
		}
	}
	.gameRule {
		display: flex;
		image {
			width: 100%;
		}
	}
	.nodata {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		text {
			color: #A1CFE6;
			font-size: 32rpx;
		}
	}
</style>
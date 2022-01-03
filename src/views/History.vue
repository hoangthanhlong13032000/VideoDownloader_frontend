<template>
	<div class="w-100 h-100 main-content flex bg-gray-50">
		<div class="w-100 h-100 main-container" ref="container">
			<div class="video-recommend">
				<div
					class="item item-render cursor-pointer"
					v-on:click="showVideo(item)"
					v-for="(item, index) in listItem"
					:key="index"
				>
					<img
						class="item-img"
						:src="item.thumbnails[item.thumbnails.length - 1].url"
						alt="video preview"
					/>
					<div class="content flex mt-1">
						<div class="content-left mr-2">
							<img
								:src="item.channel.avatar.thumb"
								alt="avatar"
								class="rounded-full channel-avatar"
							/>
						</div>
						<div class="content-right">
							<div class="item-title flex">
								<div class="title-content">
									{{ item.title }}
								</div>
							</div>
							<div class="sub-title">
								<div class="item-line">
									{{ item.channel.title }}
								</div>
								<div class="item-line">
									{{ Number(item.stats.viewCount).toLocaleString('de') }} lượt xem
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
<script>
import { mapGetters } from "vuex";

export default {
	name: "Category",
	methods: {
		showVideo(item) {
			if (item && item.id) {
				this.$store.dispatch("getVideosById", item).then(() => {
					this.$store.commit("setReloadPage", false);
					this.$router.push("/");
				});
			}
		},
	},
	computed: {
		...mapGetters({
			listItem: "listItem",
		}),
	},
	created: function () {
		this.$store.commit("setLoadingStatus", true);
		this.$store.dispatch("historyVideo").then(() => {
			this.$store.commit("setLoadingStatus", false);
			this.$store.commit("setReloadPage", true);
		});
	},
};
</script>

<style lang="scss" scoped>
.main-content {
	display: flex;
	max-height: calc(100vh - 60px);
	.main-container {
		flex: 1;
		padding: 8px;
		overflow: auto;
		.video-recommend {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
			.item {
				width: 360px;
				padding: 16px;
				display: flex;
				flex-direction: column;
				.item-img {
					border: 1px solid lightgray;
					min-height: 180px;
					max-height: 180px;
					width: 100%;
				}
				.content {
					.content-left {
						.channel-avatar {
							width: 36px;
							max-width: 36px;
							min-width: 36px;
							height: 36px;
							min-height: 36px;
							max-height: 36px;
						}
					}
					.content-right {
						.item-title {
							.title-content {
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 2; /* number of lines to show */
								line-clamp: 2;
								-webkit-box-orient: vertical;
								font-size: 14px;
								font-weight: 500;
							}
						}
						.sub-title {
							.item-line {
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1; /* number of lines to show */
								line-clamp: 1;
								-webkit-box-orient: vertical;
							}
						}
					}
				}
			}
		}
	}
}
</style>
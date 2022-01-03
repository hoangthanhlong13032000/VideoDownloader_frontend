<template>
	<div class="w-100 h-100 main-content flex bg-gray-50">
		<div class="w-100 h-100 main-container" ref="container">
			<div v-if="selectedVideo">
				<div class="video-frame">
					<video
						v-show="selectedVideo.url"
						:src="selectedVideo.url"
						style="width: 100%; height: 70vh"
						controls
						autoplay
						:poster="selectedVideo.thumbnail.url"
					></video>
				</div>
				<div class="video-content">
					<div class="content-tool-bar my-3">
						<div style="width: 250px; height: 39px">
							<v-select
								label="Quality"
								v-on:change="changeQuality()"
								v-model="selectedQuality"
								v-bind:items="videoQuality"
								dense
								solo
							></v-select>
						</div>
						<div class="mx-3">
							<v-btn
								v-on:click="addVideo()"
								elevation="2"
								style="height: 39px"
								depressed
								color="error"
								>Save
							</v-btn>
						</div>
						<div>
							<v-btn
								v-on:click="reloadVideo(detail)"
								style="height: 39px"
								color="success"
								>Reload
							</v-btn>
						</div>
					</div>
					<div class="video-name" v-show="detail.title">
						<div class="content flex mt-1">
							<div class="content-left mr-4 mt-1">
								<img
									:src="detail.channel.avatar.thumb"
									class="rounded-full"
									style="width: 56px"
								/>
							</div>
							<div class="content-right">
								<div class="mt-2">
									<div class="title-1">{{ detail.title}}</div>
									<div class="title-2">
										<a :href="detail.channel.url" target="_blank">{{ detail.channel.title }}</a>
									</div>
								</div>
							</div>
						</div>
						<div
							class="sub-title py-3"
							v-if="detail && detail.stats"
						>
							{{
								Number(detail.stats.viewCount).toLocaleString("de")
							}}
							lượt xem
							<span v-if="detail.publishDate">
								- {{ detail.publishDate }}</span
							>
						</div>
					</div>
					<div class="description">
						<div
							style="white-space: pre-line"
							v-bind:class="{ 'text-ellipsis': showMore }"
						>
							<div v-html="urlify(detail.description)"></div>
						</div>
						<div
							v-on:click="showMore = !showMore"
							class="cursor-pointer text-gray-500"
							style="
								font-weight: 500;
								border-bottom: 1px solid lightgray;
								padding: 15px 5px;
								margin-bottom: 10px;
							"
							v-if="
								detail.description &&
								this.countLine(detail.description) > 4
							"
						>
							{{ showMore ? "SHOW MORE" : "SHOW LESS" }}
						</div>
					</div>
				</div>
			</div>

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
						<div class="content-left mr-3 mt-2">
							<img
								:src="item.channel.avatar.thumb"
								alt="avatar"
								class="rounded-full"
								style="min-width: 36px; width: 36px"
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
									{{item.channel.title}}
								</div>
								<div class="item-line" v-if="item.publishedTime">
									{{ item.stats.viewCount }}
									|
									{{ item.publishedTime }}
								</div>
								<div class="item-line" v-else>
									{{ Number(item.stats.viewCount).toLocaleString("de") }}
									lượt xem
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
import { Auth } from "../../store/auth.ts";
export default {
	name: "Content",
	components: {},
	data: function () {
		return {
			mainVideoUrl: "",
			qualify: [],
			selectedQuality: null,
			selectedUrl: null,
			showMore: true,
		};
	},
	methods: {
		changeQuality() {
			this.$store.state.quality = this.selectedQuality;
		},
		showVideo(item) {
			if (item?.href) this.$store.dispatch("getVideos", item.href);
			else this.$store.commit("handleError", "Can't find video.");
		},
		reloadVideo(detail) {
			if (detail && detail.id && detail.source)
				this.$store.dispatch("reloadVideo", detail);
			else this.$store.commit("handleError", "Can't find video.");
		},
		addVideo() {
			const video = {
				id: this.detail.id,
				source: this.detail.source,
				title: this.detail.title,
				description: this.detail.description?.slice(0, 255),
				thumbnail: this.detail?.thumbnails[0]?.url,
			};
			Auth.dispatch("addVideo", video).then((res) => {
				if (res?.isSuccess)
					this.$store.commit("handleSuccess", "save success.");
				else this.$store.commit("handleError", res.message);
			});
		},
		countLine(str) {
			return str ? str.split(/\r\n|\r|\n/).length : -1;
		},
		urlify(text) {
			const urlRegex = /(https?:\/\/[^\s]+)/g;
			text = text.replace(
				urlRegex,
				'<a href="$1" target="_blank" >$1</a>'
			);
			text = text.replace(/#(\w+)/gi,'<a href="http://youtube.com/hashtag/$1" target="_blank">#$1</a>');
			return text;
		},
	},
	computed: {
		...mapGetters({
			listVideo: "listVideo",
			selectedVideo: "getFitVideo",
			detail: "getVideoDetail",
			videoQuality: "getVideoQuality",
			listItem: "listItem",
			reloadPage: "isReloadPage",
		}),
	},
	created: function () {
		if (this.reloadPage) {
			this.$store.commit("setLoadingStatus", true);
			this.$store.dispatch("searchVideo", "").then(() => {
				this.$store.commit("setLoadingStatus", false);
				this.$store.commit("setReloadPage", false);
			});
		} else if (!this.selectedQuality)
			this.selectedQuality = this.videoQuality?.[0];
	},
	watch: {
		videoQuality() {
			this.selectedQuality = this.videoQuality?.[0];
		},
		selectedVideo() {
			this.$refs.container.scrollTo(0, 0);
		},
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
		.title-1 {
			font-size: 1.4em;
			font-weight: 400;
		}
		.title-2 {
			font-size: 1.3em;
			font-weight: 450;
		}
		.sub-title {
			font-size: 14px;
		}
		.video-content {
			padding: 15px;
			.content-tool-bar {
				float: right;
				display: flex;
				align-items: center;
			}
			.description {
				.text-ellipsis {
					-webkit-line-clamp: 4; /* number of lines to show */
					line-clamp: 4;
				}
			}
		}
		.video-frame {
			width: 100%;
			min-height: 400px;
			background-color: #e8e8e8;
		}
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
	.video-unavailable {
		background-image: url("../../assets/video-unavailabel.png");
		width: 100%;
		height: 100%;
	}
}
</style>

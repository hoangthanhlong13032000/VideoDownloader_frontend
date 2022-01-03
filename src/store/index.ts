import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import Media from "@/model/media";
import Details from "@/model/details";
import IndexDB from "@/model/indexDB";
import Data from "@/model/data";

import utils from "@/js/utils.js";

const api_v1 = "https://getvideo-api.vietlach.vn/api/v1";
// const api_v1 = "http://localhost:3333";

const videoDB = new IndexDB('videoDatabase', 1);

const cacheVideo = (data: Data) => {
	const now = new Date().getTime();
	const id = data.details.id;
	const source = data.details.source;

	if (id && source) videoDB.add({
		id: `${source[0]}.${id}`,
		expire: now + 5 * 3600000,
		data: data,
	})
}
const getCachedVideo = async (source: string, id: string) => {
	if (source && id) {
		const now = new Date().getTime();
		const cachedVideo = await videoDB.read(`${source[0]}.${id}`);
		if ((now - cachedVideo?.expire) < 0) return cachedVideo.data;
	}
	return undefined;
}
const getCachedVideos = async () => {
	const cachedVideos = [];
	for (const cvd of (await videoDB.readAll())) if (cvd.data.details) cachedVideos.push(cvd.data.details);
	return cachedVideos;
}
const delCachedVideo = async (source: string, id: string) => {
	if (source && id) await videoDB.remove(`${source[0]}.${id}`);
}

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		listVideo: Array<Media>(), // danh sách video với các chất lượng khác nhau
		videoDetails: Details,
		quality: "0",
		loading: false,
		isError: false,
		isSuccess: false,
		message: "",
		isSearching: false,
		listItem: Array<Details>(), // danh sách các video xem trước
		listSuggest: JSON.parse(window.localStorage.getItem('histories') || "[]"),
		reloadPage: true, // có cần reload lại trang k // tạm thời đang dùng cho màn recommend
	},
	mutations: {
		setlistVideo(state, listVideo) {
			state.listVideo = listVideo;
			state.quality = "0";
		},
		setVideoDetail(state, detail) {
			state.videoDetails = detail;
		},
		setListPreview(state, list) {
			if (list?.length) state.listItem = list;
		},
		addListPreview(state, list) {
			state.listItem.concat(list);
		},
		setLoadingStatus(state, isLoading) {
			state.loading = isLoading;
		},
		setSearchingStatus(state, status) {
			state.isSearching = status;
		},
		handleError(state, message) {
			state.isError = true;
			state.message = message;
		},
		handleSuccess(state, message) {
			state.isSuccess = true;
			state.message = message;
		},
		setErrorStatus(state, status) {
			state.isError = status;
		},
		setSuccessStatus(state, status) {
			state.isSuccess = status;
		},
		setReloadPage(state, status) {
			state.reloadPage = status;
		},
		setListSuggests(state, list) {
			if (list.length) state.listSuggest = list;
		}
	},
	actions: {
		async reloadVideo(context, video) {
			context.commit("setSearchingStatus", true);
			await delCachedVideo(video.source, video.id);
			this.dispatch("getVideosById", video);
		},
		getVideos(context, textSearch: string) {
			if (utils.isHttpRequest(textSearch)) {
				this.dispatch("getVideosByURL", textSearch);
			} else {
				utils.saveHistory(textSearch)
				this.dispatch("searchVideo", textSearch);
			}
		},
		async getVideosByURL(context, textSearch: string) {
			context.commit("setSearchingStatus", true);

			const { source, id } = utils.extractURL(textSearch);

			let data = await getCachedVideo(source, id);
			if (!data) {
				await axios.post(`${api_v1}/api/video/all`, { url: textSearch })
					.then((res: any) => {data = res.data.data;cacheVideo(data);})
			}
			if (data?.status == 1) {
				context.commit("setlistVideo", [
					...data.videos,
					...data.video_only,
					...data.audio_only,
				]);
				context.commit("setVideoDetail", data.details);
				context.commit("setListPreview", data.recommends);
			} else context.commit("handleError", "Can't find video.");

			context.commit("setSearchingStatus", false);
		},

		async getVideosById(context, details: Details) {
			context.commit("setSearchingStatus", true);

			const id = details.id;
			const source = details.source || "youtube";

			let data = await getCachedVideo(source, id);

			if (!data) {
				await axios.get(`${api_v1}/api/video/${source}?id=${id}`)
				.then((res: any) => {data = res.data.data;cacheVideo(data);})
			}
			
			if (data?.status == 1) {
				context.commit("setlistVideo", [
					...data.videos,
					...data.video_only,
					...data.audio_only,
				]);
				context.commit("setVideoDetail", data.details);
				context.commit("setListPreview", data.recommends);
			} else context.commit("handleError", "Can't find video.");

			context.commit("setSearchingStatus", false);
		},

		async searchVideo(context, textSearch: string) {
			context.commit("setSearchingStatus", true);
			await axios
				.get(`${api_v1}/api/search/youtube?search_query=${textSearch}`)
				.then((res: any) => {
					if (res.data.status == 1) {
						context.commit("setlistVideo", []);
						context.commit("setVideoDetail", Details);
						context.commit("setListPreview", res.data.data);
					}
				})
				.catch(function () {
					context.commit("handleError", "Can't find video.");
				})
				.finally(() => {
					context.commit("setSearchingStatus", false);
					context.commit("setLoadingStatus", false);
				});
		},
		async trendingVideo(context, videoType = "trending") {
			// videoType = "trending", "music", "movie", "gaming"
			
			await axios
				.get(`${api_v1}/api/search/youtube/${videoType}`)
				.then((res: any) => {
					if (res.data.status == 1) {
						context.commit("setlistVideo", []);
						context.commit("setVideoDetail", Details);
						context.commit("setListPreview", res.data.data);
					}
				})
				.catch(function () {
					context.commit("handleError", "Can't find video.");
				})
				.finally(() => {
					context.commit("setSearchingStatus", false);
					context.commit("setLoadingStatus", false);
				});
		},
		async historyVideo(context) {
			context.commit("setLoadingStatus", true);

			const cachedVideos = await getCachedVideos();

			context.commit("setlistVideo", []);
			context.commit("setVideoDetail", Details);
			context.commit("setListPreview", cachedVideos);
			context.commit("setLoadingStatus", false);
		},
		async getSuggests(context, textSearch) {
			let listSuggest = [];

			if (!textSearch) listSuggest = JSON.parse(window.localStorage.getItem('histories') || "[]");
			else await axios
				.get(`${api_v1}/api/suggest?search_query=${textSearch}`)
				.then((res: any) => listSuggest = res?.data?.data || [])
			context.commit("setListSuggests", listSuggest);
		}
	},
	getters: {
		listVideo(state) {
			return state.listVideo;
		},
		getFitVideo(state) {
			const index = Number(state.quality?.split(" - ")?.[0]) || 0;
			const fitVideo = state.listVideo[index];
			if (fitVideo) {
				const thumbnails = state.videoDetails["thumbnails"] || [];
				fitVideo["thumbnail"] = thumbnails[thumbnails.length - 1] || {
					url: "",
				};
			}
			return fitVideo;
		},
		getVideoQuality(state) {
			const listQualify: string[] = [];
			for (let i = 0; i < state.listVideo.length; i++) {
				const video = state.listVideo[i];
				let label = `${i}`;
				if (video.quality) label += ` - ${video.quality}`;
				if (video.audioQuality) label += ` - ${video.audioQuality}`;
				if (video.container) label += ` - ${video.container}`;
				listQualify.push(label);
			}
			return listQualify;
		},
		getLoadingStatus(state) {
			return state.loading;
		},
		getVideoDetail(state) {
			return state.videoDetails;
		},
		listItem(state) {
			return state.listItem;
		},
		listSuggest(state) {
			return state.listSuggest;
		},
		isSearching(state) {
			return state.isSearching;
		},
		isSuccess(state) {
			return state.isSuccess;
		},
		isError(state) {
			return state.isError;
		},
		message(state) {
			return state.message;
		},
		isReloadPage(state) {
			return state.reloadPage;
		},
	},
	modules: {},
});
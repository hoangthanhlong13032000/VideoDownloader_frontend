import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Video from "@/model/video";
import Details from "@/model/details";
import VideoPreview from "@/model/video-preview";

const api_v1 = "https://getvideo-api.vietlach.vn/api/v1";
// const api_v1 = "http://localhost:3333";

function isHttpRequest(text) {
  const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  return regex.test(text);
}
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    listVideo: Array<Video>(), // danh sách video với các chất lượng khác nhau
    videoDetails: Details,
    quality: "0",
    loading: false,
    isError: false,
    isSuccess: false,
    message: "",
    isSearching: false,
    listItem: Array<VideoPreview>(), // danh sách các video xem trước
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
      state.listItem = list;
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
  },
  actions: {
    getVideos(context, textSearch) {
      context.commit("setSearchingStatus", true);
      if (isHttpRequest(textSearch)) {
        this.dispatch("getVideosByURL", textSearch);
      } else {
        this.dispatch("searchVideo", textSearch);
      }
    },
    async getVideosByURL(context, textSearch) {
      await axios
        .post(`${api_v1}/api/video/all`, { url: textSearch })
        .then((res: any) => {
          if (res && res.data && res.data.data) {
            const data = res.data.data;
            if (data.status == 1) {
              context.commit("setlistVideo", [
                ...data.videos,
                ...data.video_only,
                ...data.audio_only,
              ]);
              context.commit("setVideoDetail", data.details);
              if (data.recommends.length)
                context.commit("setListPreview", data.recommends);
            }
          }
        })
        .catch(function() {
          context.commit("handleError", "Can't find video.");
        })
        .finally(() => {
          context.commit("setLoadingStatus", false);
          context.commit("setSearchingStatus", false);
        });
    },
    async getVideosById(context, video) {
      await axios
        .get(`${api_v1}/api/video/${video.source || "youtube"}?id=${video.id}`)
        .then((res: any) => {
          if (res && res.data && res.data.data) {
            const data = res.data.data;
            if (data.status == 1) {
              context.commit("setlistVideo", [
                ...data.videos,
                ...data.video_only,
                ...data.audio_only,
              ]);
              context.commit("setVideoDetail", data.details);
              if (data.recommends.length)
                context.commit("setListPreview", data.recommends);
            }
          }
        })
        .catch(function() {
          context.commit("handleError", "Can't find video.");
        })
        .finally(() => {
          context.commit("setSearchingStatus", false);
          context.commit("setLoadingStatus", false);
        });
    },
    async searchVideo(context, textSearch) {
      await axios
        .get(`${api_v1}/api/search/youtube?search_query=${textSearch}`)
        .then((res: any) => {
          if (res && res.data && res.data.status == 1) {
            context.commit("setlistVideo", []);
            context.commit("setVideoDetail", Details);
            context.commit("setListPreview", res.data.data || []);
          }
        })
        .catch(function() {
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
          if (res && res.data && res.data.status == 1) {
            context.commit("setlistVideo", []);
            context.commit("setVideoDetail", Details);
            context.commit("setListPreview", res.data.data || []);
          }
        })
        .catch(function() {
          context.commit("handleError", "Can't find video.");
        })
        .finally(() => {
          context.commit("setSearchingStatus", false);
          context.commit("setLoadingStatus", false);
        });
    },
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

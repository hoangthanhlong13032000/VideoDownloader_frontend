<template>
  <div class="w-100 h-100 main-content p-3 flex bg-gray-50">
    <div class="w-100 h-100 main-container">
      <div v-if="selectedVideo">
        <div class="video-frame">
          <video
            v-show="selectedVideo.url"
            :src="selectedVideo.url || ''"
            style="width: 100%; height: 70vh"
            controls
            :poster="selectedVideo.thumbnail.url"
          ></video>
        </div>
        <div class="video-content">
          <div class="content-tool-bar my-3">
            <div style="width: 300px; height: 40px">
              <v-select
                label="Qualify"
                v-on:change="changeQuality()"
                v-model="selectedQuality"
                v-bind:items="videoQuality"
                dense
                solo
              ></v-select>
            </div>
            <div style="width: 150px; height: 40px" class="mx-3">
              <v-btn
                v-on:click="addVideo()"
                elevation="2"
                style="height: 40px"
                depressed
                color="error"
                >Add Video</v-btn
              >
            </div>
          </div>
          <div class="video-name" v-show="detail.title">
            <div class="content flex mt-1">
              <div class="content-left mr-2">
                <img
                  :src="detail.channel.avatar.thumb"
                  class="rounded-full channel-avatar"
                />
              </div>
              <div class="content-right">
                <div class="title-1">
                  {{ detail.channel.title }}
                  <br>
                  {{ detail.title }}
                </div>
              </div>
            </div>
            <div class="sub-title py-3" v-if="detail && detail.stats">
              {{ Number(detail.stats.viewCount).toLocaleString() }} views
              <span v-if="detail.publishDate"> - {{ detail.publishDate }}</span>
            </div>
          </div>
          <div style="white-space: pre-line" class="description">
            {{ detail.description }}
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
            :src="(item.thumbnails[1] || item.thumbnails[0]).url"
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
                  {{ item.stats.viewCount }} | {{ item.publishedTime }}
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
    };
  },
  methods: {
    changeQuality() {
      this.$store.state.quality = this.selectedQuality;
    },
    showVideo(item) {
      if (item && item.href) {
        this.$store.dispatch("getVideos", item.href);
      } else {
        this.$store.commit("handleError", "Can't find video.");
      }
    },
    addVideo() {
      let me = this;
      // let thumbnailURL = new URL(me.detail.thumbnails[0]?.url);
      // let thumbnail = thumbnailURL.origin + thumbnailURL.pathname || "";
      let video = {
        id: me.detail.id,
        source: me.detail.source,
        title: me.detail.title,
        description: me.detail.description?.slice(0, 255),
        thumbnail: me.detail?.thumbnails[0]?.url,
      };
      Auth.dispatch("addVideo", video).then((res) => {
        if (res && res.isSuccess) {
          this.$store.commit("handleSuccess", "save success.");
        } else {
          this.$store.commit("handleError", res.message);
        }
      });
    },
  },
  computed: {
    ...mapGetters({
      listVideo: "listVideo",
      selectedVideo: "getFitVideo",
      detail: "getVideoDetail",
      videoQuality: "getVideoQuality",
      listItem: "listItem",
      reloadPage: "isReloadPage"
    }),
  },
  created: function () {
    if (this.reloadPage) {
      this.$store.commit("setLoadingStatus", true);
      this.$store.dispatch("searchVideo", "").then(() => {
        this.$store.commit("setLoadingStatus", false);
      });
      this.$store.commit("setReloadPage", false);
    }
  },
  watch: {
    videoQuality() {
      this.selectedQuality = this.videoQuality[0];
    },
  },
};
</script>
<style lang="scss" scoped>
.main-content {
  // background-color: #e5e6eb;
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
    .sub-title {
      font-size: 14px;
    }
    .video-content {
      .content-tool-bar {
        width: 100%;
        display: flex;
        align-items: center;
      }
    }
    .video-frame {
      width: 100%;
      min-height: 400px;
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
          border: 1px solid;
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
  .video-unavailable {
    background-image: url("../../assets/video-unavailabel.png");
    width: 100%;
    height: 100%;
  }
}
</style>

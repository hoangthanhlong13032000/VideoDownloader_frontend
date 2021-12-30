<template>
  <div class="main-view">
    <div class="w-100 h-100 main-content flex bg-gray-50">
      <div class="w-100 h-100 main-container">
        <div
          class="item w-100 h-100 cursor-pointer"
          v-for="item in listItem"
          :key="item.id"
        >
          <div
            class="w-100 h-100 cursor-pointer d-flex"
            v-on:click="showVideo(item)"
          >
            <img
              v-if="item.thumbnail"
              class="item-img"
              :src="item.thumbnail"
              alt="avt"
              width="220px"
              height="150px"
            />
            <div
              class="video-unavailable item-img"
              width="220px"
              height="150px"
              v-if="!item || !item.thumbnail"
            ></div>
            <div class="content">
              <div class="title text-ellipsis">
                {{ item.title }}
              </div>
              <div class="sub-title text-ellipsis">
                {{ item.description }}
              </div>
            </div>
          </div>
          <div class="icon-d" v-on:click="deleteVideo(item)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
<script>
import { Auth } from "../store/auth.ts";
export default {
  name: "Facebook",
  components: {},
  data: function() {
    return {};
  },
  methods: {
    showVideo(item) {
      if (item && item.id) {
        this.$store.commit("setLoadingStatus", true);
        this.$store.dispatch("getVideosById", item).then((res) => {
          this.$store.commit("setReloadPage", false);
          this.$router.push("/");
          this.$store.commit("setLoadingStatus", false);
        });
      }
    },
    deleteVideo(video) {
      Auth.dispatch("deleteVideo", video);
    },
  },
  computed: {
    listItem() {
      return Auth.getters.facebookVideos;
    },
  },
  created: function() {
    let me = this;
    this.$store.commit("setLoadingStatus", true);
    Auth.dispatch("getSavedVideos").then((res) => {
      this.$store.commit("setLoadingStatus", false);
    });
  },
};
</script>
<style lang="scss" scoped>
.main-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .main-view-container {
    display: flex;
    flex: 1;
  }
}
.main-content {
  // background-color: #e5e6eb;
  display: flex;
  max-height: calc(100vh - 60px);
  .main-container {
    flex: 1;
    padding: 8px;
    overflow: auto;
    .item {
      width: 100%;
      height: 150px;
      padding: 16px;
      display: flex;
      .icon-x {
        position: absolute;
        right: 30px;
        width: 25px;
        height: 25px;
      }
      border-bottom: 1px solid #bbbbbb;
      .item-img {
        border: 1px solid lightgray;
        height: 100%;
        width: 220px;
        min-width: 220px;
        max-width: 220px;
        min-height: 100%;
        max-height: 100%;
      }
      .content {
        padding: 0 16px 0 16px;
        .title {
        }
        .sub-title {
        }
        .text-ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>

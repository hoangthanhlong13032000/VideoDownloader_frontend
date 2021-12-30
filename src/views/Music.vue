<template>
  <div class="main-view">
    <div class="w-100 h-100 main-content flex bg-gray-50">
      <div class="w-100 h-100 main-container" id="musicContainer">
        <div class="item w-100 h-100 cursor-pointer" v-for="item in listItem">
          <div
            class="w-100 h-100 cursor-pointer d-flex"
            v-on:click="showVideo(item)"
          >
            <img
              v-if="item.thumbnails[0]"
              class="item-img"
              :src="(item.thumbnails[1] || item.thumbnails[0]).url"
              width="220px"
              height="150px"
            />
            <div
              class="video-unavailable item-img"
              width="220px"
              height="150px"
              v-else
            ></div>
            <div class="content">
              <div class="title text-ellipsis">
                {{ item.title }}
              </div>
              <div class="sub-title text-ellipsis">
                {{ item.channel.title }} - {{ item.stats.viewCount }} -
                {{ item.publishedTime }}
              </div>
              <div class="text-ellipsis">
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
        <div class="music-spin d-none" ref="musicSpin">
          <v-progress-circular
            indeterminate
            color="primary"
            class="spin"
          ></v-progress-circular>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
<script>
import { mapGetters } from "vuex";

export default {
  name: "Music",
  components: {},
  methods: {
    showVideo(item) {
      if (item && item.id) {
        this.$store.commit("setLoadingStatus", true);
        this.$store.dispatch("getVideosById", item).then(() => {
          this.$store.commit("setReloadPage", false);
          this.$router.push("/");
          this.$store.commit("setLoadingStatus", false);
        });
      }
    },
    scroll() {
      let el = document.getElementById("musicContainer");
      let me = this;
      el.onscroll = () => {
        // me.$refs.musicSpin.classList.remove("d-none");
        // if (el.offsetHeight + el.scrollTop >= el.scrollHeight) {
        //   this.$store.dispatch("loadMoreTrendingVideo", "music").then(() => {
        //     me.$refs.musicSpin.classList.add("d-none");
        //   });
        // }
      };
    },
  },
  computed: {
    ...mapGetters({
      listItem: "listItem",
    }),
  },
  created: function() {
    this.$store.commit("setLoadingStatus", true);
    this.$store.dispatch("trendingVideo", "music").then(() => {
      this.$store.commit("setLoadingStatus", false);
    });
    this.$store.commit("setReloadPage", true);
  },
  mounted: function() {
    this.scroll();
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
        .text-ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2; /* number of lines to show */
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .sub-title {
          -webkit-line-clamp: 1 !important; /* number of lines to show */
          line-clamp: 1 !important;
        }
      }
    }
    .music-spin {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>

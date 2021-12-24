<template>
  <div class="input-search-container">
    <div class="input-search-content">
      <input
        type="text"
        placeholder="Paste your video link here"
        v-model="textSearch"
        v-on:keyup.enter="onSearching"
      />
      <button
        class="button-search"
        aria-label="Search"
        v-on:click="onSearching"
      >
        <div class="icon-search">
          <svg
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
            class="style-scope yt-icon"
            style="pointer-events: none; display: block; width: 100%; height: 100%;"
          >
            <g class="style-scope yt-icon">
              <path
                d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"
                class="style-scope yt-icon"
              ></path>
            </g>
          </svg>
        </div>
      </button>
    </div>
    <v-progress-linear
      style="margin-top: 4px;"
      v-show="isSearching"
      indeterminate
      color="#2b3173"
    ></v-progress-linear>
  </div>
</template>
<style lang="scss" scoped>
.input-search-container {
  width: 100%;
  margin-left: 16px;
  .input-search-content {
    height: 36px;

    display: flex;
    input {
      background-color: #ffffff;
      color: #111111;
      border: 1px solid #ccc;
      box-shadow: inset 0 1px 2px #eee;
      outline: none;
      width: 100%;
      height: 100%;
      padding: 5px 10px;
    }
    .button-search {
      background-color: #d3d3d3;
      width: 64px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-search {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
<script>
import { mapGetters } from "vuex";

export default {
  name: "InputSearch",

  components: {},
  data: function() {
    return {
      textSearch: "",
    };
  },
  props: ["value"],
  methods: {
    /**
     * Tìm kiếm video
     * VMHUNG 12/10/2021
     */
    onSearching(e) {
      this.$store.dispatch("getVideos", this.textSearch);
      this.$store.commit("setReloadPage", false);
      if (this.$router.path != '/' && this.$router?.history?.current?.path != '/') {
        this.$router.push("/");
      }
    },
  },
  watch: {
    value() {
      this.dValue = this.value;
    },
  },
  mounted() {
    this.dValue = this.value;
  },
  computed: {
    ...mapGetters({
      isSearching: "isSearching",
    }),
  },
};
</script>

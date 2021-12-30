<template>
  <div class="input-search-container">
    <div class="input-search-content">
      <input
        type="text"
        placeholder="Paste your video link here"
        v-model="textSearch"
        v-on:keyup.enter="onSearching()"
        v-on:keydown="onTyping()"
      />
      <button class="button-clear" @click="clear">
        x
      </button>
      <button
        class="button-search"
        aria-label="Search"
        v-on:click="onSearching()"
      >
        <div class="icon-search">
          <svg
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
            class="style-scope yt-icon"
            style="
              pointer-events: none;
              display: block;
              width: 100%;
              height: 100%;
            "
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
      style="margin-top: 4px"
      v-show="isSearching"
      indeterminate
      color="#2b3173"
    ></v-progress-linear>
    <div class="input-search-suggest">
      <div class="item" v-for="(sg, i) in listSuggest" @click="onSearching(sg)" :key="i">
        {{ sg }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.input-search-container {
  position: relative;
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
      &:focus {
        border-color: #2b3173;
      }
    };
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
    .button-clear {
      position: absolute;
      height: 25px;
      width: 25px;
      right: 63px;
      top: 15%;
      text-align: center;
      border-radius: 13px;
      &:hover {
        background-color: lightgray;
      }
    }
  }
  .input-search-suggest {
    position: absolute;
    display: block;
    box-shadow: 0 4px 8px 0 rgba(7, 6, 6, 0.3);
    background-color: white;
    cursor: pointer;
    z-index: 10;
    width: calc(100% - 62px);
    padding: 5px;
    .item {
      padding: 5px;
      &:hover {
        background-color: #d3d3d3;
      }
    }
  }
}
</style>
<script>
import { mapGetters } from "vuex";
let timer;

export default {
  name: "InputSearch",

  components: {},
  data: function () {
    return {
      textSearch: ""
    };
  },
  props: ["value"],
  methods: {
    onSearching(text) {
      this.textSearch = text || this.textSearch;
      this.$store.dispatch("getVideos", this.textSearch);
      this.$store.commit("setReloadPage", false);
      if (
        this.$router.path != "/" &&
        this.$router?.history?.current?.path != "/"
      ) {
        this.$router.push("/");
      }
    },
    async onTyping() {
      const self = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        self.$store.dispatch("getSuggests", self.textSearch);
      }, 300);
    },
    clear() {
      this.textSearch = "";
      this.onTyping();
    }
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
      listSuggest: "listSuggest",
    }),
  },
};
</script>

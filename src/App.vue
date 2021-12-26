<template>
  <v-app>
    <div class="main-view">
      <v-alert type="success" dense :value="isSuccess">
        {{ message || "success." }}
      </v-alert>
      <v-alert type="error" dense :value="isError">
        {{ message || "An error occurred, please try again later." }}
      </v-alert>
      <div class="main-view-container">
        <Menu />
        <div class="flex flex-column" style="flex: 1;">
          <Header />
          <!-- <Footer /> -->
          <!-- <Content /> -->
          <!-- <Category /> -->
          <div class="content">
            <Loader v-if="loading" class="mask-load" />
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Content from "./components/layout/Content.vue";
import Header from "./components/layout/Header.vue";
import Menu from "./components/layout/Menu.vue";
import Loader from "./components/base/loader.vue";
import { mapGetters } from "vuex";

import "./css/icon.css";
import "./css/table.css";
import "./css/button.scss";
import "./css/common.css";
import "./css/font.css";
import "./css/input.css";
import "./css/main.css";
import "./assets/tailwind.css";

export default Vue.extend({
  name: "App",
  components: { Content, Header, Menu, Loader },
  data: () => ({
    //
  }),
  computed: {
    ...mapGetters({
      isError: "isError",
      isSuccess: "isSuccess",
      loading: "getLoadingStatus",
      message: "message",
    }),
  },
  watch: {
    isError: function() {
      setTimeout(() => {
        this.$store.commit("setErrorStatus", false);
      }, 3000);
    },
    isSuccess: function() {
      setTimeout(() => {
        this.$store.commit("setSuccessStatus", false);
      }, 3000);
    },
  },
});
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
    .content {
      position: relative;
      min-height: calc(100vh - 60px);
    }
  }
}
</style>

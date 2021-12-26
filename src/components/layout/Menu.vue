<template>
  <div class="menu-side-bar " v-bind:class="{ minimize: isMinimize }">
    <!--logo trang cukcuk-->
    <div class="logo-site d-flex" style="border-bottom: 1px solid #F3F4F6;">
      <svg
        v-on:click="resizeMenu()"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
      <a href="../" tooltips="  " class="item-content ml-5">
        <div
          class=" h-100 d-flex align-item-center justify-content-center text-green-500 text-base"
        >
          Downloader
        </div>
      </a>
    </div>
    <!--các tính năng trong menu-->
    <div class="nav-content">
      <router-link
        v-for="item in menuList"
        :key="item.id"
        class="nav-item"
        :to="item.route"
        v-on:click.native="selectMenu(item)"
        v-bind:class="{ 'menu-active': item.id == selectedMenu }"
      >
        <div class="menu-item">
          <div class="d-icon" :class="item.icon"></div>
          <div class="nav-item-text item-content">{{ item.name }}</div>
          <div v-if="item.subLinks" v-on:click.prevent="toggleSubmenu(item.id)">
            <div class="d-icon icon-arrow-down p-3 ml-2"></div>
          </div>
        </div>
        <div class="sub-menu d-none" :id="'subMenu' + item.id">
          <router-link
            v-for="submenu in item.subLinks"
            :key="submenu.id"
            :to="submenu.route"
            class="menu-item sub-menu-item"
          >
            <div class="d-icon" :class="submenu.icon"></div>
            <div class="nav-item-text item-content">{{ submenu.name }}</div>
          </router-link>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data: function() {
    return {
      drawer: true,
      menuList: [
        {
          name: "Home",
          route: "/",
          id: 0,
          icon: "icon-home",
        },
        {
          name: "All Category",
          route: "/category",
          id: 1,
          icon: "icon-earth",
          subLinks: [
            {
              name: "Youtube",
              route: "/youtube",
              id: 2,
              icon: "icon-youtube",
            },
            {
              name: "Facebook",
              route: "/facebook",
              id: 3,
              icon: "icon-facebook",
            },
            {
              name: "TikTok",
              route: "/tiktok",
              id: 4,
              icon: "icon-heart",
            },
          ],
        },

        {
          name: "Trending",
          route: "/trending",
          id: 5,
          icon: "icon-trending",
        },
        {
          name: "Music",
          route: "/music",
          id: 6,
          icon: "icon-music", 
        },
        {
          name: "Movie",
          route: "/movie",
          id: 7,
          icon: "icon-movie",
        },
        {
          name: "Gaming",
          route: "/gaming",
          id: 8,
          icon: "icon-back",
        },
      ],
      selectedMenu: 1,
      isMinimize: false,
    };
  },
  methods: {
    selectMenu(item) {
      this.selectedMenu = item.id;
      // if (item.subLinks) {
      //   this.toggleSubmenu(item.id);
      // }
    },
    resizeMenu() {
      this.isMinimize = !this.isMinimize;
    },
    toggleSubmenu(id) {
      let ele = document.getElementById("subMenu" + id);
      if (ele) {
        let isHide = ele.classList?.contains("d-none");
        if (isHide) {
          ele.classList.remove("d-none");
        } else {
          ele.classList.add("d-none");
        }
      }
    },
  },
  mounted() {
    let me = this;
    this.selectedMenu = this.menuList.findIndex((item) => {
      return item.route.toLowerCase() == me.$route.path.toLowerCase();
    });
    //thiếu check đã login
    if (this.selectedMenu < 0) {
      this.selectedMenu = 0;
    }
    // console.log(this.selectedMenu);
  },
  computed: {
    currentRoute() {
      return this.$route.path;
    },
  },
  watch: {
    currentRoute() {
      let me = this;
      this.selectedMenu = this.menuList.findIndex((item) => {
        return item.route.toLowerCase() == me.$route.path.toLowerCase();
      });
    },
  },
};
</script>
<style scoped lang="scss">
.d-icon {
  background-size: unset;
  width: 25px;
  height: 30px;
  margin-right: 5px;
}
/*thanh menu*/
.menu-side-bar {
  float: left;
  width: 180px;
  min-width: 180px;
  max-width: 180px;
  height: 100%;
  .menu-item {
    height: 55px;
    display: flex;
    align-items: center;
    padding: 10px;
  }
  .sub-menu {
    display: flex;
    flex-direction: column;
    .sub-menu-item {
      padding-left: 25px;
    }
    .menu-item:hover {
      padding-left: 20px !important;
    }
  }
}
.minimize {
  width: 50px !important;
  min-width: 50px !important;
  max-width: 50px !important;
  .item-content {
    display: none;
  }
  .nav-item {
    padding: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.nav-item-text {
  font-size: 14px;
  font-weight: 600;
  color: black;
}

.menu-side-bar .logo-site {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  /* background-color: #1e235a; */
  /* color: #ffffff; */
  color: black;
  padding: 10px;
  font-weight: 600;
}

.menu-side-bar .logo-site .logo-icon {
  background-image: url("../../assets/Icon/Logo_Full_White.png");
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
}

/*thanh menu dưới logo*/
.menu-side-bar .nav-content {
  width: 100%;
  height: 100%;
  /* background-color: #2b3173; */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-side-bar .nav-content .nav-item {
  width: 100%;
  font-weight: 300;
  // height: 55px;
  flex-direction: column;
  display: flex;
  // align-items: center;
  justify-content: center;
  color: #aaacc7;
  cursor: pointer;
  line-height: 17px;
  text-decoration: none;
}

.menu-side-bar .nav-content .nav-item .menu-item:hover {
  background-color: #f3f4f6;
  padding-left: 5px;
}

.menu-side-bar .nav-content .nav-item:active {
  background-color: #019160;
  font-family: GoogleSans-Medium;
}

.nav-item .nav-item-icon {
  background-repeat: no-repeat;
  height: 38px;
  width: 22px;
  margin-left: 8px;
  margin-right: 10px;
}
.last-nav-item {
  border-top: 1px solid #1e235a;
}
.menu-active {
  background-color: #e5e5e5 !important;
}
</style>

<template>
  <div class="header">
    <!--hộp thoại lựa chọn cửa hàng-->
    <div class="header-left">
      <div class="header-left-content">
        {{ $route.name }}
      </div>
    </div>
    <div class="header-main-action">
      <div class="main-action-container">
        <InputSearch value="" />
      </div>
    </div>
    <!--avatar, thông báo-->
    <div class="header-right">
      <div class="account-area">
        <div class="d-icon avatar-default" v-on:click="changeProfile()"></div>
        <div class="account-name">{{ email }}</div>
        <router-link v-show="!email" to="/login">
          Sign In
        </router-link>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              height="18px"
              width="18px"
              min-width="0"
              v-bind="attrs"
              v-on="on"
              class=" transparent-btn"
            >
              <div class="d-icon icon-arrow-down sm-icon"></div>
            </v-btn>
          </template>
          <v-list v-show="email">
            <v-list-item v-on:click="changeProfile()">
              <v-list-item-title>Change password</v-list-item-title>
            </v-list-item>
            <v-list-item v-on:click="signOut()">
              <v-list-item-title>
                <!-- <router-link to="/login" v-on:click.native="">
                </router-link> -->
                <div>
                  Sign out
                </div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <!-- <a class="d-icon icon-support"></a> -->
      <div style="height: 52px; width: auto; border-right: 1px solid #e1e1e1">
        <a class="d-icon icon-notify sm-icon"></a>
      </div>
      <a class="d-icon icon-help sm-icon"></a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.d-icon {
  width: 16px;
  height: 18px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: block;
  cursor: pointer;
}
.v-list {
  padding: 0px;
  .v-list-item {
    min-height: 30px;
    cursor: pointer;
    .v-list-item__title {
      font-size: 13px;
    }
  }
  .v-list-item:hover {
    .v-list-item__title {
      color: #1867c0;
    }
  }
}

.account-area {
  display: flex;
  align-items: center;
}
.sm-icon {
  margin: 17px 17px;
}
.header {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f3f4f6;
  /* border-left: 1px solid #bbbbbb; */
  // margin-left: 150px;
  color: #212121;
  .header-main-action {
    flex: 0.8;
    .main-action-container {
      display: flex;
    }
  }
}

.header .header-left .header-left-content {
  padding: 18px 0px 18px 21px;
  font-weight: 700;
  font-size: 18px;
  width: 80px;
  white-space: nowrap;
  z-index: 2;
}
.header .header-right {
  display: flex;
  align-items: center;
}

.header .store-option {
  padding: 7px;
  min-width: 162px;
  margin: 0px;
  height: 32px;
  border: 1px solid #c3c3c3;
  border-radius: 3px;
  outline: none !important;
}
.header .account-name {
  margin-left: 16px;
  font-weight: bold;
  white-space: nowrap;
  cursor: pointer;
}
.header-right .avatar-default {
  margin-left: 16px;
  width: 30px;
  height: 30px;
}
.header-right .icon-support {
  width: 46px;
  height: 52px;
  background-position: center;
  background-repeat: no-repeat;
}
.header-right .icon-notify {
  background-color: white;
}
</style>
<script>
import InputSearch from "../base/input-search.vue";
import { Auth } from "../../store/auth.ts";
export default {
  name: "Header",
  components: { InputSearch },
  data: function() {
    return {};
  },
  methods: {
    signOut() {
      Auth.dispatch("signOut");
      this.$router.push("/login");
    },
    changeProfile() {
      // Auth.dispatch("signOut");
      this.$router.push("/profile");
    },
  },
  computed: {
    email() {
      console.log(Auth.state.email);
      return Auth.state.email;
    },
  },
};
</script>

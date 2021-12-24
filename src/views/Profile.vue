<template>
  <div class="w-full h-full flex items-center justify-center bg-gray-50">
    <div class="sm:w-1/2 xl:w-1/3">
      <div
        class="border-teal p-8 border-t-12 mb-6 rounded-lg shadow-lg bg-white"
      >
        <div class="mb-5">
          <h1 class="font-bold text-grey-darker block mb-2 text-lg">
            Change Profile
          </h1>
        </div>
        <div class="mb-5">
          <label class="font-bold text-grey-darker block mb-2">Email</label>
          <input
            type="text"
            class="block appearance-none d-height w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
            placeholder="Your email"
            v-model="email"
          />
        </div>
        <div class="mb-5">
          <label class="font-bold text-grey-darker block mb-2"
            >Old Password</label
          >
          <input
            type="password"
            class="block d-height appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
            placeholder="Your password"
            v-model="password"
          />
        </div>
        <div class="mb-5">
          <label class="font-bold text-grey-darker block mb-2"
            >New Password</label
          >
          <input
            type="password"
            class="block d-height appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
            placeholder="Your password"
            v-model="newPassword"
          />
          <span v-show="isAuthFalse" class="text-red-500 mt-1">{{
            message
          }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <a
            @click="updateProfile()"
            href="#"
            class="btn-primary-outline d-height bg-indigo-600"
          >
            <span class="text-white">Update</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from "../store/auth.ts";
import axios from "axios";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      email: "",
      password: "",
      show: false,
      isVerify: false,
      isAuthFalse: false,
      newPassword: "",
      message: "",
    };
  },
  methods: {
    updateProfile() {
      let currentPassword = this.$store.getters.password;
      if (this.password != currentPassword && currentPassword) {
        this.isAuthFalse = true;
        this.message = "Current pass word not correct";
      } else {
        let me = this;
        Auth.dispatch("updateProfile", {
          email: me.email,
          newPassword: me.password,
        }).then((res) => {
          if (res && res.isSuccess) {
            this.$store.commit("handleSuccess", "save success.");
          } else {
            this.$store.commit("handleError", res.message);
          }
        });
      }
    },
    recoverPassword() {},
  },
};
</script>

<style scoped lang="scss">
input {
  border: none !important;
  outline: none !important;
  &.focus {
    --tw-bg-opacity: 1;
    background-color: red;
  }
}
.btn-black {
  &:hover {
    span {
      color: black;
    }
  }
}
.d-height {
  height: 42px !important;
}
</style>

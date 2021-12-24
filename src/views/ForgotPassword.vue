<template>
  <div class="w-full h-full flex items-center justify-center bg-gray-50">
    <div class="sm:w-1/2 xl:w-1/2">
      <div
        v-if="!isSentEmail"
        class="border-teal p-8 border-t-12 mb-6 rounded-lg shadow-lg bg-white "
      >
        <div class="mb-5">
          <h1 class="font-bold text-grey-darker block mb-2 text-lg">
            Find Your Account
          </h1>
        </div>
        <div class="mb-5">
          <label class="font-bold text-grey-darker block mb-2">
            Please enter your email address to search for your account.
          </label>
          <input
            type="text"
            class="block appearance-none d-height w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
            placeholder="Your email"
            v-model="email"
          />
        </div>
        <div class="flex gap-2" tabindex="0">
          <a
            href="#"
            class="btn-primary-outline d-height bg-indigo-600"
            v-on:click="recover()"
          >
            <span class="text-white">Search</span>
          </a>

          <router-link to="/login" class="btn-black d-height">
            <span class="text-white">Cancel</span>
          </router-link>
        </div>
      </div>
      <router-link to="/login" v-if="isSentEmail">
        <div class="">please check your email.</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Auth } from "../store/auth";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      email: "",
      password: "",
      isSentEmail: false,
    };
  },
  methods: {
    recover() {
      Auth.dispatch("recover", this.email).then((res) => {
        if (res.isSuccess) {
          this.isSentEmail = true;
        } else {
          this.$store.commit("handleError", "");
        }
      });
    },
  },
  created: function() {
    this.isSentEmail = false;
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

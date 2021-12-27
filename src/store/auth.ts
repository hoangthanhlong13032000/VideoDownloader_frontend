import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const auth_v1 = "https://getvideo-api.vietlach.vn/auth/v1";
// const api_v1 = "https://getvideo-api.vietlach.vn/api/v1";
const api_v1 = "http://localhost:3333";

//cache
function setCookie(name, value, exp_days) {
  const d = new Date();
  d.setTime(d.getTime() + exp_days * 24 * 60 * 60 * 1000);
  document.cookie =
    name + "=" + value + ";" + "expires=" + d.toUTCString() + ";path=/";
}
function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(cname) == 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}
function deleteCookie(name) {
  const d = new Date();
  d.setTime(d.getTime() - 60 * 60 * 1000);
  document.cookie = name + "=;" + "expires=" + d.toUTCString() + ";path=/";
}

export const Auth = new Vuex.Store({
  state: {
    email: "",
    password: "",
    token: "",
    id: "",
    listSavedVideo: [],
  },
  mutations: {
    setUser(state, { email, password, token = state.token }) {
      state.email = email;
      state.password = password;
      state.token = token;
    },
    setListSavedVideos(state, listVideo) {
      state.listSavedVideo = listVideo;
    },
    deleteVideo(state, video) {
      if (video && video.id && video.source) {
        const index = state.listSavedVideo.findIndex(
          (x) => x.id == video.id && x.source == video.source
        );
        if (index >= 0) {
          state.listSavedVideo.splice(index, 1);
        }
      }
    },
  },
  actions: {
    async signIn(context, { email, password }) {
      let isLoginSuccess = false;
      await axios
        .post(
          `${auth_v1}/token?grant_type=password&username=${email}&password=${password}`
        )
        .then((result: any) => {
          if (result.data) {
            const token = result?.data?.access_token;
            context.commit("setUser", { email, password, token });

            deleteCookie("email");
            deleteCookie("token");
            deleteCookie("password");

            setCookie("email", email, 1);
            setCookie("token", token, 1);
            setCookie("password", password, 1);

            isLoginSuccess = true;
          }
        })
        .catch((err) => {
          console.log(err);
          isLoginSuccess = false;
        });

      return isLoginSuccess;
    },
    signOut(context) {
      context.commit("setUser", {});
      deleteCookie("email");
      deleteCookie("token");
      deleteCookie("password");
    },
    async signUp(context, { email, password }) {
      const res = {
        success: false,
        message: "",
      };
      await axios
        .post(`${auth_v1}/signup`, {
          email: email,
          password: password,
        })
        .then((result) => {
          res.success = true;
        })
        .catch((err) => {
          console.log(err);
          res.success = false;
          res.message = err?.response?.data?.msg || "";
        });
      return res;
    },
    async getSavedVideos(context) {
      const token = context.state.token || getCookie("token");
      await axios
        .get(`${api_v1}/auth/video`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res: any) => {
          if (res?.data?.data)
            context.commit("setListSavedVideos", res.data.data);
        })
        .catch(function() {
          context.commit("handleError", "Can't get saved video list.");
        });
    },
    async addVideo(context, video) {
      const token = context.state.token || getCookie("token");
      const result = {
        isSuccess: false,
        message: "",
      };
      await axios
        .post(`${api_v1}/auth/video`, video, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res: any) => {
          if (res) result.isSuccess = true;
        })
        .catch(function(error) {
          result.isSuccess = false;
          result.message = error?.response?.data?.message || "";
        });
      return result;
    },
    async deleteVideo(context, video) {
      if (video && video.id) {
        context.commit("deleteVideo", video);
        const token = context.state.token || getCookie("token");
        await axios
          .delete(`${api_v1}/auth/video`, {
            headers: {
              Authorization: "Bearer " + token,
            },
            data: {
              source: video.source,
              id: video.id,
            },
          })
          .then((res: any) => {
            console.log(res);
          })
          .catch(function(error) {
            console.log("delete error: ", error);
          });
      }
    },
    /**
     * Lấy lại mk
     * @param context
     * @param email
     */
    async recover(context, email) {
      let res = {
        isSuccess: false,
        message: "",
      };
      await axios
        .post(`${auth_v1}/recover`, { email: email })
        .then(() => {
          res.isSuccess = true;
        })
        .catch(function(err) {
          res.isSuccess = false;
          res.message = "";
        });
      return res;
    },
    async updateProfile(context, { email, password }) {
      let res = {
        isSuccess: false,
        message: "",
      };
      let params = {
        email: email,
        password: password,
        data: {
          key: "",
          number: 10,
          admin0: false,
        },
      };
      const token = context.state.token || getCookie("token");
      await axios
        .put(`${auth_v1}/user`, params, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((result) => {
          res.isSuccess = true;
          // context.commit("setUser", { email, password });
          context.dispatch("signOut");
        })
        .catch(function(err) {
          res.isSuccess = false;
          res.message = err?.response?.data?.msg || "";
        });
      return res;
    },
  },
  getters: {
    userInfo(state) {
      return {
        email: state.email,
        password: state.password,
      };
    },
    loginStatus(state) {
      state.email = getCookie("email");
      return state.email;
    },
    savedVideos(state) {
      return state.listSavedVideo;
    },
    youtubeVideos(state) {
      return state.listSavedVideo.filter(
        (x) => x.source.toLowerCase() == "youtube"
      );
    },
    tikTokVideos(state) {
      return state.listSavedVideo.filter(
        (x) => x.source.toLowerCase() == "tiktok"
      );
    },
    facebookVideos(state) {
      return state.listSavedVideo.filter(
        (x) => x.source.toLowerCase() == "facebook"
      );
    },
    getPassword(state) {
      return state.password || getCookie("password");
    },
  },
});

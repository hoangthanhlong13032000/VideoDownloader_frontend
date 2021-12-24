<template>
  <div class="bigContainer">
    <div class="container">
      <div class="login-form">
        <form action="" method="post">
          <h1>Sign up</h1>
          <div class="input-box">
            <v-text-field
              v-model="email"
              type="text"
              placeholder="Enter your email"
              label="Email"
              :rules="[rules.required, rules.email]"
            ></v-text-field>
          </div>
          <div class="input-box">
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              label="Password"
              :rules="[rules.required]"
              @click:append="show = !show"
            ></v-text-field>
          </div>
          
          <div class="btn-box">
            <button type="submit" @click="signUp">Sign up</button>
             <div class=".have-account">
              Already have an account? 
              <router-link to="/login">Log in</router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  padding: 0px;
  margin: 0px;
  font-family: sans-serif;
  font-size: 20px;
  box-sizing: border-box;
}

.container {
  width: 70%;
  max-width: 1200px;
}

.bigContainer {
  background-color: #e5e6eb;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  width: 60%;
  background-color: #ffffff;
  padding: 32px;
  margin: auto;
  text-align: left;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

h1 {
  color: #2b3173;
  font-size: 24px;
  margin-bottom: 24px;
  text-align: left;
  margin-top: 16px;
}

.input-box {
  margin-bottom: 16px;
}

.input-box input {
}

.btn-box {
  text-align: left;
  margin-top: 16px;
}

.btn-box button {
  padding: 8px 16px;
  background-color: #2b3173;
  color: #ffffff;
  border: none;
  outline: none;
  margin-bottom: 16px;
}

.signup {
  text-align: left;
  color: red;
  font-size: 18px;
}
.btn-box {
  display: flex;
  justify-content: space-between;
  .have-account {
    font-size: 12px;

  }
}
</style>

<script>
// import { ref } from "vue";
import { supabase } from "../supabase";
export default {
  name: "Content",
  components: {},
  data: function() {
    return {
      loading: false,
      email: "",
      password: "",
      show:false,
      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 20 || "Max 20 characters",
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    };
  },
  methods: {
    async signUp() {
      try {
        this.loading = true;
        const { error } = await supabase.auth.signUp({
          email: this.email,
          password: this.password,
        });
        if (error) throw error;
        
      } catch (error) {
        alert(error.error_description || error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

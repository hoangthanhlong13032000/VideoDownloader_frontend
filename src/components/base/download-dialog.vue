<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" depressed color="error" v-on="on" class="">
          Get
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          NEW DOWNLOAD
        </v-card-title>
        <div class="dialog-content">
          <v-text-field
            v-model="address"
            label="Address"
            hide-details="auto"
          ></v-text-field>
        </div>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="getDownloadFile()">
            DOWNLOAD NOW
          </v-btn>
          <v-btn color="primary" text @click="dialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "DownloadDialog",

  data() {
    return {
      dialog: false,
      address: "",
    };
  },
  methods: {
    async getDownloadFile() {
      this.$store.dispatch("getVideos", this.address);
      this.dialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.lg-icon {
  width: 32px;
  height: 32px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
}
.add-btn {
  min-width: 0 !important;
  padding: 0 !important;
}
.dialog-content {
  padding: 10px 16px;
}
</style>

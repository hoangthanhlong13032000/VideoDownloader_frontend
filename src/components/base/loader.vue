<template>
  <div class="mask-loader bg-gray-50">
    <v-progress-circular
      indeterminate
      color="primary"
      class="spin"
    ></v-progress-circular>
  </div>
</template>
<style scoped></style>
<script>
export default {
  name: "Loader",
  data: function() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.mask-loader {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // background-color: #000000bb;
}
</style>

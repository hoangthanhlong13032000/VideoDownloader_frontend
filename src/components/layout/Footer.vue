<template>
  <div class="footer px-5">
    <div class="footer-content">
      <DownloadDialog />
      <InputSearch value=""/>
    </div>
  </div>
</template>
<style scoped></style>
<script>
import DownloadDialog from "../base/download-dialog.vue";
import InputSearch from "../base/input-search.vue";

export default {
  name: "Footer",
  components: { DownloadDialog, InputSearch },
  data: function() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.footer {
  width: 100%;
  height: 52px;
  background-color: #f0f0f0;
  display: flex;
  .footer-content {
    display: flex;
    flex: 1;
    align-items: center;
  }
}
</style>

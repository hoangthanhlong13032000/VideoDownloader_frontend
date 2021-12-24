<template>
  <div class="alertSuccess">{{ notify }}</div>
</template>
<style scoped>
@keyframes float {
  0% {
    box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.6);
    transform: translatex(0px);
  }
  60% {
    box-shadow: 0 25px 15px 0px rgba(0, 0, 0, 0.2);
    transform: translatex(-100px);
  }

  100% {
    box-shadow: 0 25px 15px 0px rgba(0, 0, 0, 0.2);
    opacity: 0.2;
    transform: translatex(-100px);
  }
}
.alertSuccess {
  z-index: 5;
  position: fixed;
  bottom: 50px;
  right: 0px;
  padding: 0 16px;
  border-radius: 6px;
  background-color: lightgreen;
  text-align: center;
  line-height: 50px;
  color: darkgreen;
  box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.6);
  border-bottom: 2px solid;
  transform: translatey(0px);
  animation: float 6s ease-in-out;
}
</style>
<script>
export default {
  name: "alert",
  props: {
    notify: String,
  },
};
</script>

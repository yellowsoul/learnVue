<template>
  <div class="toast" v-show="isShow">
    <div>{{message}}</div>
  </div>
</template>

<script>
export default {
  name:"Toast",
  props: {
    // message: {
    //   type:String,
    //   default:''
    // },
    // show:{
    //   type:Boolean,
    //   default:false
    // }
  },
  data(){
    return {
      message:'',
      isShow:false,
      timer:null
    }
  },
  methods: {
    show(message='提示文字', duration = 1500) {
      this.isShow = true;
      this.message = message
      
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.isShow = false;
        this.message = '';
      },duration)
    }
  }
}
</script>

<style scoped>
.toast{
  position: fixed;
  left:50%;
  top:50%;
  padding:8px 10px;
  transform: translate(-50%,-50%);
  color:#fff;
  background-color:rgba(0, 0, 0, .75);
  border-radius:2px;
  z-index: 999;
}
</style>
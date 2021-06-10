<template>
<div class="list-tag">
  <template v-for="i in list" :key="i.path">
    <div v-if="i.path!=0" class="level-tag" @click="toMap(i.path)" :class="{'over':level < i.path}">
      第 {{i.path}} 关
    </div>
  </template>
</div>
</template>

<script>
import mapConfig from "/@/config/index.js"
export default {
  data(){
    return {
      list:[],
      level: 1
    }
  },
  created(){
    this.list = Object.keys(mapConfig).map(i=>{
      return {
        path: i,
      }
    })
    this.level = Number(localStorage.getItem('lvl') || 1)
    this.maplvl = Number(localStorage.getItem('maplvl') || 1)
    if(this.maplvl > this.level){
      this.level = this.maplvl
      localStorage.setItem('lvl',this.level)
    }
    this.backMusicPlay('list')
  },
  beforeUnmount(){
    this.backMusicPause()
  },
  methods:{
    toMap(path){
      if(path > this.level){
        return
      }
      this.$router.push({
        name:"map",
        params:{
          level: path
        }
      })
    }
  }
}
</script>

<style lang="scss">
.list-tag{
  box-sizing: border-box;
  width: 1366px;
  height: 700px;
  margin: auto;
  background:  url('/img/loadscreen.png') no-repeat;
  background-size: 100% 100%;
  padding: 180px 106px 20px;
  .level-tag{
    float: left;
    width: 128px;
    height: 30px;
    line-height: 30px;
    background:  url('/img/menubutton2.png') no-repeat;
    background-size: 128px 32px;
    color: #fff;
    cursor: pointer;
    &:hover{
      background:  url('/img/menubutton2_hover.png') no-repeat;
      background-size: 128px 32px;
    }
    &.over,&.over:hover{
      filter: grayscale(100);
      cursor:not-allowed;
    }
  }
}
</style>
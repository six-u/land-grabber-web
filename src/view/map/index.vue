<template>
  <div class="map">
    <Canvas ref="canvas" v-if="loading" :mapLevel='Number(level)' :roads="roads" @gameOver="gameOver"></Canvas>

    <div class="ui">
      <div class="reset" @click="reset">重玩此关</div>
      <div class="level">关卡 {{level}}</div>
      <div class="timer">{{playTime}}</div>
      <div class="tax">{{tax}}</div>
    </div>
    <div v-if="LGRTStatus!='start'" class="mask">
      <div class="start" v-if="LGRTStatus == 'no-start' || LGRTStatus == 'pause'">
        <p @click="start">Start</p>
      </div>
      <template v-if="LGRTStatus=='success'||LGRTStatus=='fail'">
        <template v-if="page == 1">
          <div class="gameover" :class="LGRTStatus">
            <div class="player-name">{{playerName}}</div>
            <div class="status">{{LGRTStatus}}</div>
          </div>
          <div class="sword left"></div>
          <div class="sword right"></div>
        </template>
        <div class="settle" :class="{fail:LGRTStatus=='fail'}" v-if="page==2">
          <p class="title">{{LGRTStatus=='success'?'恭喜你':'很遗憾'}}, {{playerName}}</p>
          <p class="used-time">{{playTime}}</p>
          <template v-if="LGRTStatus=='success'">
            <p class="time-rate" :class="'l'+timeRate()">{{rateStr[timeRate()]}}</p>
            <p class="time-target" :class="'l'+timeRate()">（需要挑战的时间是：{{timeTarget}}）</p>
          </template>
          <template v-if="LGRTStatus=='fail'">
            <p class="time-rate">你输了， {{LGRT.winnerFaction}} 获胜！</p>
          </template>
          <div class="settle-box">
            <div class="settle-item">
              <p class="label">最大人口数：</p>
              <p class="value">{{LGRT.userSettlementData.maxPopulation}}</p>
            </div>
            <div class="settle-item">
              <p class="label">派出士兵：</p>
              <p class="value">{{LGRT.userSettlementData.sendTroopNum}}</p>
            </div>
            <div class="settle-item">
              <p class="label">最大建筑数：</p>
              <p class="value">{{LGRT.userSettlementData.maxBuild}}</p>
            </div>
            <div class="settle-item">
              <p class="label">损失士兵：</p>
              <p class="value">{{LGRT.userSettlementData.battleDamage + LGRT.userSettlementData.internalFriction}}</p>
            </div>
          </div>
          <div class="btn" @click="overDown">{{LGRTStatus=='success'?'下一关':'重新开始'}}</div>
          <!-- maxPopulation: 0, // 最大人口数
          maxBuild: 0, // 最大建筑数
          sendTroopNum: 0, // 出兵数
          battleDamage: 0, // 战损人数
          internalFriction: 0, // 内耗人数 -->
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import Canvas from "./Canvas.vue"
import { ref, reactive, provide, toRefs, watch } from "vue"
import mapConfig from "/@/config/index.js"
import {masterRecord,rateString} from "./options"

export default {
  name: "map",
  components:{
    Canvas
  },
  data() {
    return {
      LGRTStatus: "no-start",
      level: 1,
      user: [],
      builds: [],
      roads: [],
      loading: false,
      playTime: '00:00:00',
      tax: 0,
      showHelp: false,
      step: 1,
      page: 1,
      playerName: '',
      timeTarget: '00:05:01',
      playerSettleData:{
        timeConsuming: 0, // 耗时
        maxPopulation: 0, // 最大人口数
        maxBuild: 0, // 最大建筑数
        sendTroopNum: 0, // 出兵数
        battleDamage: 0, // 战损人数
        internalFriction: 0, // 内耗人数
      },
      winnerSettleData:{
        faciton: '',
        timeConsuming: 0, // 耗时
        maxPopulation: 0, // 最大人口数
        maxBuild: 0, // 最大建筑数
        sendTroopNum: 0, // 出兵数
        battleDamage: 0, // 战损人数
        internalFriction: 0, // 内耗人数
      },
      rateStr: []
    };
  },
  created() {
    if(this.$route.params.level){
      this.level = Number(this.$route.params.level)
      sessionStorage.setItem('maplvl',this.level)
    }else{
      this.level = Number(sessionStorage.getItem('maplvl'))
    }
    this.playerName = localStorage.getItem('usr')
    this.rateStr = rateString
    this.timeTarget = this.getTimeString(masterRecord[this.level])

    let Config = mapConfig[this.level]
    this.user = reactive(Config.user);
    this.builds = reactive(Config.builds);
    this.roads = reactive(Config.roads);

    // 注册vue3数据监听
    // 初始化
    this.LGRT.init(this.user, this.builds, this.roads);
    this.loading = true
    setInterval(()=>{
      this.playTime = this.getTimeString(this.LGRT.playTimes)
      this.tax = Object.values(this.LGRT.users).filter(user=>{
        if(user.isPlayer){
          return user
        }
      })[0].tax
    },1000)
    let i = Math.round(Math.random()*5)+1
    this.backMusicPlay('map'+i)
  },
  beforeUnmount(){
    this.backMusicPause()
  },
  methods: {
    getTimeString(second){
      let h = Math.floor(second / 3600)
      let tempM = (second-3600*h),
          m = Math.floor(tempM/60),
          s = Math.floor(tempM%60)
      h = h<10? '0'+ h : '' + h
      m = m<10? '0'+ m : '' + m
      s = s<10? '0'+ s : '' + s
      return h+":"+m+":"+s
    },
    start() {
      this.LGRT.start();
      this.LGRTStatus = "start"
      this.$refs.canvas.draw();
      sessionStorage.setItem('STStamp', new Date().getTime())
    },
    gameOver(user){
      this.playerSettleData = {
        ...this.LGRT.userSettlementData
      }
      this.winnerSettleData = {
        faciton: user.faciton,
        ...this.LGRT.winnerSettlementData
      }
      this.page = 1
      setTimeout(()=>{
        this.page = 2
      },2000)
      this.backMusicPause()
      if(user.isPlayer){
        // 成功
        this.LGRTStatus = "success"
        localStorage.setItem('maplvl',1+this.level)
        let timeLevel = this.timeRate()
        if(timeLevel == 0){
          this.backMusicPlay('flawless_victory', false)
        }else{
          this.backMusicPlay('victory', false)
        }
      }else{
        // 失败
        this.LGRTStatus = "fail"
        this.backMusicPlay('defeat', false)
      }
    },
    timeRate(){
      let dc = this.LGRT.playTimes - masterRecord[this.level]
      if(dc<=0){
        return 0
      }else if(dc>0 && dc<= 30000){
        return 1
      }else if(dc>30000 && dc< 120000){
        return 2
      }else{
        return 3
      }
    },
    overDown(){
      if(this.LGRTStatus == 'success'){
        this.$router.push({
          name:"list",
        })
      }else{
        this.reset()
      }
    },
    reset(){
      location.reload()
    }
  },
};
</script>
<style lang="scss">
.map {
  position:relative;
  width: 1366px;
  height: 700px;
  margin: auto;
  overflow: hidden;
  .ui{
    color: #fff;
    text-shadow: 0 0 3px #000;
    font-size: 16px;
    .timer{
      position: absolute;
      top: 11px;
      left: 110px;
    }
    .tax{
      position: absolute;
      top: 8px;
      right: 30px;
      font-size: 24px;
    }
    .reset{
      position: absolute;
      top: 4px;
      left: 8px;
      padding: 8px;
      cursor: pointer;
    }
    .level{
      position: absolute;
      top: 11px;
      right: 120px;
      font-size: 14px;
      cursor: default;
    }
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    // background:  url('/img/sky.png') no-repeat;
    background-color: rgba($color: #424242, $alpha: 0.75);
    background-size: 100%;
    color: #fff;
    text-shadow: 0 0 3px #000;
    font-size: 16px;
    .start {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -44px;
      margin-top: -28px;
      padding: 8px 16px;
      font-size: 3em;
      font-weight: 700;
      text-shadow: 0 0 5px #000;
      cursor: pointer;
      z-index: 2;
    }
    .gameover{
      width: 360px;
      height: 360px;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      background-color: #fff;
      text-shadow: 0 0 3px #000;
      font-size: 24px;
      letter-spacing: 3px;
      z-index: 4;
      &.success{
        background: url('/img/shield_win.png') no-repeat;
        background-size: 100% 100%;
      }
      &.fail{
        background: url('/img/shield_defeat.png') no-repeat;
        background-size: 100% 100%;
      }
      .player-name{
        padding-top: 105px;
      }
      .status{
        padding-top: 25px;
      }
    }
    .sword{
      width: 144px;
      height: 576px;
      background: url('/img/sword.png') no-repeat;
      background-size: 100% 100%;
      position: absolute;
      top: 20px;
      z-index: 3;
      &.left{
        left: 600px;
        animation: swordLeft 0.5s ease-out;
        transform: rotate(-35deg);
      }
      &.right{
        right: 600px;
        animation: swordRight 0.5s ease-out;
        transform: rotate(35deg);
      }
    }
    @keyframes swordLeft {
      0% {
        transform: rotate(-270deg);
        left: -500px;
        top: 500px;
      }
      98% {
        left: 580px;
        top: 0px;
      }
      100% {

      }
    }
    @keyframes swordRight {
      0% {
        transform: rotate(270deg);
        right: -500px;
        top: 500px;
      }
      98% {
        right: 580px;
        top: 0px;
      }
      100% {

      }
    }
    .settle{
      width: 600px;
      height: 620px;
      margin: auto;
      background:  url('/img/settle.png') no-repeat;
      background-size: 100%;
      position: relative;
      &.fail{
        filter: grayscale(.7);
      }
      .title{
        padding-top: 200px;
        font-size: 1.3em;
      }
      .used-time{
        padding-top: 10px;
        font-size: 1.2em;
      }
      .time-rate{
        padding-top: 10px;
        font-size: 1.5em;
        font-weight: 700;
      }
      .time-target{
        padding-top: 10px;
        font-size: 0.8em;
        font-weight: 700;
      }
      .l0{
        color: #fe745b;
      }
      .l1{
        color: #f3c736;
      }
      .l2{
        color: #00ad4f;
      }
      .l3{
        color: #a08ec9;
      }
      .settle-box{
        padding: 10px 50px;
        overflow: hidden;
      }
      .settle-item{
        padding: 12px 10px;
        float: left;
        width: 230px;
        .label{
          padding-left: 40px;
          text-align: left;
        }
        .value{
          padding-top: 8px;
        }
      }
      .btn{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 108px;
        margin: auto;
        letter-spacing: 2px;
        font-size: 1.1em;
        cursor: pointer;
      }
    }
  }
}
</style>

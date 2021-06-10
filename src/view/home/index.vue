<template>
  <div class="home_bg">
    <h1>Land Grabbers</h1>
    <router-link :to='{name:"list"}' class="start_flag"></router-link>
    <router-link to='/option' class="option_flag"></router-link>
    <div class="exit_flag"></div>
    <p class="user-name">{{user}}</p>
    <p class="level">Round {{level}}</p>
    <div class="help-btn" @click="toHelp">帮助</div>
    <div v-if="!user" class="user-dialog">
      <div class="container">
        <p class="title">创建角色</p>
        <p class="input"><input v-model="username" type="text" class="user-input"></p>
        <p class="btn"><button @click="save">确定</button></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      user: '',
      username: '',
      level: 1,
    }
  },
  created(){
    this.user = localStorage.getItem('usr')
    this.level = localStorage.getItem('lvl') || 1
    localStorage.setItem('lvl', this.level)
    this.backMusicPlay('home')
  },
  beforeUnmount(){
    this.backMusicPause()
  },
  methods:{
    save(){
      this.user = this.username
      localStorage.setItem('usr',this.user)
    },
    toHelp(){
      this.$router.push("/help")
    }
  }
}
</script>
<style lang="scss" scope>

  .home_bg {
    position:relative;
    width: 1366px;
    height: 700px;
    margin:auto;
    background:  url('/img/menu.png') no-repeat, url('/img/sky.png') no-repeat;
    background-size: 100% 700px, 100% 700px;
    h1{
      padding: 16px;
      font-size: 3em;
      color: #FFF;
      text-shadow: 0 0 5px #000;
    }
    .start_flag{
      position: absolute;
      top: 342px;
      left: 237px;
      display: block;
      width: 200px;
      height: 82px;
      background: url('/img/sign_start.png') 0 0 no-repeat;
      background-size: 100%;
      &:hover{
        background-position: 0 -82px;
      }
    }
    .option_flag{
      position: absolute;
      top: 221px;
      left: 1100px;
      display: block;
      width: 150px;
      height: 66px;
      background: url('/img/sign_options.png') 0 0 no-repeat;
      background-size: 100%;
      &:hover{
        background-position: 0 -66px;
      }
    }
    .exit_flag{
      position: absolute;
      top: 443px;
      left: 183px;
      display: block;
      width: 72px;
      height: 37px;
      background: url('/img/sign_exit.png') 0 0 no-repeat;
      background-size: 100%;
      &:hover{
        background-position: 0 -37px;
      }
    }
    .user-name{
      position: absolute;
      top: 458px;
      left: 1002px;
      color: #f1f1f1;
      width: 200px;
      text-shadow: 0 0 3px #000;
      font-size: 24px;
      letter-spacing: 3px;
      text-transform: uppercase;
      transform: rotate(5.5deg);
      text-align: center;
      cursor: default;
    }
    .level{
      position: absolute;
      top: 505px;
      left: 996px;
      color: #dfdfdf;
      width: 200px;
      text-shadow: 0 0 3px #000;
      font-size: 18px;
      line-height: 36px;
      letter-spacing: 3px;
      transform: rotate(5deg);
      text-align: center;
      cursor: default;
    }
    .help-btn{
      position: absolute;
      top: 0;
      right: 0;
      text-shadow: 0 0 3px #000;
      color: #fff;
      padding: 4px;
      cursor: pointer;
    }
    .user-dialog{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.3);
      z-index: 2;
      .container{
        width: 280px;
        height: 150px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background-color: rgba($color: #eee, $alpha: 0.7);
        border-radius: 20px;
        padding: 12px;
        p{
          padding: 8px 12px;
          color: #fff;
          text-shadow: 0 0 3px #000;
          &.title{
            font-size: 18px;
            font-weight: 700;
          }
          &.input{
            input{
              box-sizing: border-box;
              width: 100%;
              outline: none;
              background: #fff;
              border: 1px solid #fff;
              padding: 8px 12px;
              border-radius: 8px;
              color: #fff;
              text-shadow: 0 0 3px #000;
              text-align: center;
              font-size: 16px;
              caret-color: #ccc;
            }
          }
          &.btn{
            button{
              box-sizing: border-box;
              width: 100%;
              padding: 8px 12px;
              border: none;
              outline: none;
              background: #fff;
              color: #fff;
              text-shadow: 0 0 3px #000;
              font-size: 16px;
              cursor: pointer;
              border-radius: 8px;
              &:hover{
                background-color: #f1f1f1;
              }
            }
          }
        }
      }
    }
  }
</style>
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import Router from './router/index.js'

import LGRT from "./logic/main.ts";
import preImg from "./images/index.ts";
import preMusic from "./audio/index.ts";

const app = createApp(App)

// 创建并全局挂载运行时对象
const LGruntime = new LGRT();  // LandGrabberRuntime
app.config.globalProperties.LGRT = LGruntime;

// 创建并全局挂载预加载图片
app.config.globalProperties.buildImgList = preImg.buildImgList;
app.config.globalProperties.solderImgList = preImg.solderImgList;
app.config.globalProperties.bloodImgList = preImg.bloodImgList;
app.config.globalProperties.uiImg = preImg.uiImg;
app.config.globalProperties.backMusicPlay = preMusic.backMusicPlay;
app.config.globalProperties.backMusicPause = preMusic.backMusicPause;
app.config.globalProperties.soundEffectPlay = preMusic.soundEffectPlay;


app.use(Router).mount("#app");

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

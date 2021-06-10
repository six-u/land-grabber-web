class musicList {
  [key: string]: any
}

const backMusicPath:musicList = {
  home: "./audio/music/main_theme.ogg",
  list: "./audio/music/map_theme.ogg",
  map1: "./audio/music/gameplay_theme1.ogg",
  map2: "./audio/music/gameplay_theme2.ogg",
  map3: "./audio/music/gameplay_theme3.ogg",
  map4: "./audio/music/gameplay_theme4.ogg",
  map5: "./audio/music/gameplay_theme5.ogg",
  flawless_victory: "./audio/music/flawless_victory.ogg", // 打破大师记录
  victory: "./audio/music/victory.ogg", // 胜利
  defeat: "./audio/music/defeat.ogg"  // 失败
};

const soundEffectPath: musicList = {
  tower: "./audio/sfx/shot_tower.ogg",
  select: "./audio/sfx/select.ogg",
  unselect: "./audio/sfx/cancel_select.ogg",
  uplevel: "./audio/sfx/upgrade_city.ogg", // 升级
  occupy: "./audio/sfx/capture_city.ogg", // 占领
  slump: "./audio/sfx/lost_city.ogg", // 陷落
  Cavalry_go: "./audio/sfx/go_Cavalry.ogg", // 骑兵运动
  Militia_go: "./audio/sfx/go_Militia.ogg", // 步兵运动
  Armor_go: "./audio/sfx/go_Armor.ogg", // 攻城兵运动
  Cavalry_fight: "./audio/sfx/fight_army3_far.ogg", // 骑兵运动
  Militia_fight: "./audio/sfx/fight_army1_far.ogg", // 步兵运动
  Armor_fight: "./audio/sfx/fight_army2_far.ogg", // 攻城兵运动
};

// 背景音乐 循环播放
let currentBgAudio: any = ""
const backMusicPlay = (pathKey: string, type:boolean = true): void => {
  currentBgAudio = new Audio(backMusicPath[pathKey]);
  currentBgAudio.loop = type
  currentBgAudio.play()
}
// 背景音乐 暂停
const backMusicPause = () => {
  currentBgAudio.pause()
}
// 音效播放
let currentSeAudio:any = ""
const soundEffectPlay = (pathKey: string, type: boolean = false): void => {
  if(type){
    let currentSeAudio = new Audio(soundEffectPath[pathKey]);
    if(currentSeAudio.paused || currentSeAudio.ended){
      currentSeAudio.play()
    }
  }else{
    if(!currentSeAudio || currentSeAudio.paused || currentSeAudio.ended){
      currentSeAudio = new Audio(soundEffectPath[pathKey]);
      currentSeAudio.play()
    }
  }
  
}
const soundEffectPause = () => {
  currentSeAudio.pause()
}

export default {
  backMusicPlay,
  backMusicPause,
  soundEffectPlay,
  soundEffectPause
}
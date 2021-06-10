<template>
  <div class="draw-canvas" id="canvasBox">
    <canvas id="mapCanvas"></canvas>
  </div>
</template>
<script>
import { BuildType, Faction } from "../../logic/enum";
import {
  factionColor,
  towerColors,
  towerRadius,
  solderSprite,
} from "./options.ts";
let canvas;
let ctx;
export default {
  name: "Canvas",
  props: {
    mapLevel: {
      rquired: true,
      type: Number,
      default: 1,
    },
    roads: {
      required: true,
    },
    drawTimer: 0,
  },
  data() {
    return {
      ourSelectImg: "",
      enemySelectImg: "",
      soldierImg: "",
      frame: [0, 3, 7],
      count: 0,
      barWidth: 0,
    };
  },
  mounted() {
    this.initDraw();
    this.barWidth = document.getElementById("canvasBox").offsetWidth - 150;
  },
  beforeUnmount(){
    this.backMusicPause()
  },
  methods: {
    // 初始化画布
    initDraw() {
      this.createSelectImgDOM();
      let canvasBox = document.getElementById("canvasBox");
      canvas = document.getElementById("mapCanvas");
      let oleft = Math.round(canvas.offsetLeft / 2);
      canvas.width = canvasBox.clientWidth;
      canvas.height = canvasBox.clientHeight;
      ctx = canvas.getContext("2d");
      // 绘制道路
      this.drawRoads();
      // 绘制建筑
      this.drawBuilds();
      // 绘制人口比例条
      this.drawPopulationBar();
      // 绘制UI
      this.drawUI();
      // 添加鼠标点击事件
      canvas.addEventListener("click", e => {
        let [target, isUp] = this.locateBuild(e.x - oleft, e.y, "cl");
        if (isUp) {
          target.levelUp(this.LGRT);
        } else if (target) {
          let result = this.LGRT.interactive(
            true,
            target,
            this.LGRT.actionBuild
          );
          result ? (this.LGRT.actionBuild = {}) : "";
        }
      });
      // 添加鼠标移动事件
      canvas.addEventListener("mousemove", e => {
        this.locateBuild(e.x - oleft, e.y, "mv");
      });
      // 添加鼠标双击事件
      canvas.addEventListener("dblclick", e => {
        let [target] = this.locateBuild(e.x - oleft, e.y, "dbl");
        if (target) {
          let result = this.LGRT.interactive(
            false,
            target,
            this.LGRT.actionBuild
          );
          result ? (this.LGRT.actionBuild = {}) : "";
        }
      });
      // 添加鼠标双击事件
      canvas.addEventListener("contextmenu", e => {
        this.soundEffectPlay('unselect')
        this.LGRT.unSelect();
      });
    },
    // 清空画布
    clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    // 创建选中图片DOM
    createSelectImgDOM() {
      this.ourSelectImg = new Image();
      this.ourSelectImg.src = './img/our_selector.png';
      this.enemySelectImg = new Image();
      this.enemySelectImg.src = './img/enemy_selector.png';
      this.soldierImg = new Image();
      this.soldierImg.src = './img/animation/Armor_blue.png';
    },
    // 定位建筑
    locateBuild(x, y, type) {
      // 获取点中的建筑
      let xmin,
        xmax,
        ymin,
        ymax,
        buildListValue = Object.values(this.LGRT.buildList),
        len = buildListValue.length;
      while (len > 0) {
        let build = buildListValue[len - 1];
        xmin = build.x - 40;
        xmax = build.x + 40;
        ymin = build.y - 64;
        ymax = build.y + 16;
        if (x > build.x + 44 && x < build.x + 54 && y > build.y - 45 && y < build.y - 25) {
          if (!build.isUping && build.population > build.level * 5) {
            return [build, true]; // up level
          }else{
            return [build, false];
          }
        }
        if (x > xmin && x < xmax && y > ymin && y < ymax) {
          if (type == "cl") {
            if (build.isPlayer) {
              build.selected = true;
            }
            this.backMusicPlay('select')
            return [build, false];
          }
          if (type == "mv") {
            build.hover = true;
          }
          if (type == "dbl") {
            return [build, false];
          }
        } else {
          build.hover = false;
        }
        len--;
      }
      return ["", false];
    },
    // 绘制道路
    drawRoads() {
      ctx.lineJoin = "round";
      ctx.lineWidth = 45;
      this.roads.forEach(v => {
        // 阴影
        ctx.strokeStyle = "#333";
        ctx.beginPath();
        ctx.moveTo(v[0] + 1, v[1] + 1);
        ctx.lineTo(v[2] + 1, v[3] + 1);
        ctx.stroke();
        ctx.closePath();
        ctx.stroke();
        // 道路
        ctx.strokeStyle = "#e4fdeb";
        ctx.beginPath();
        ctx.moveTo(v[0], v[1]);
        ctx.lineTo(v[2], v[3]);
        ctx.stroke();
        ctx.closePath();
        ctx.stroke();
      });
    },
    // 绘制建筑
    drawBuilds() {
      Object.values(this.LGRT.buildList).forEach(build => {
        // 绘制建筑图片
        ctx.drawImage(
          this.buildImgList[`${build.type}_${build.faction}_${build.level}`],
          build.x - 64,
          build.y - 96,
          128,
          128
        );
        // 绘制防御塔范围
        if (build.type == "Tower") {
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(
            build.x,
            build.y - 16,
            towerRadius[build.level],
            0,
            Math.PI * 2
          );
          ctx.fillStyle = towerColors[build.faction][0];
          ctx.fill();

          ctx.beginPath();
          ctx.strokeStyle = towerColors[build.faction][1];
          ctx.arc(
            build.x,
            build.y - 16,
            towerRadius[build.level],
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
        // 绘制建筑人口
        //   背景
        ctx.lineJoin = "round";
        ctx.lineWidth = 16;
        ctx.strokeStyle = factionColor[build.faction];
        ctx.beginPath();
        ctx.moveTo(build.x - 16, build.y + 25);
        ctx.lineTo(build.x + 20, build.y + 25);
        ctx.closePath();
        ctx.stroke();
        //   文字
        ctx.font = "16px STheiti, SimHei";
        ctx.fillStyle = "#fff";
        ctx.fillText(
          build.population + "/" + build.level * 10,
          build.x - 16,
          build.y + 30
        );

        // 绘制升级按钮
        if (
          build.isPlayer &&
          build.level < 5 &&
          !build.isUping &&
          build.population > build.level * 5
        ) {
          ctx.lineJoin = "round";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.fillStyle = build.faction;
          ctx.moveTo(build.x + 44, build.y - 45);
          ctx.lineTo(build.x + 54, build.y - 35);
          ctx.lineTo(build.x + 48, build.y - 35);
          ctx.lineTo(build.x + 48, build.y - 25);
          ctx.lineTo(build.x + 40, build.y - 25);
          ctx.lineTo(build.x + 40, build.y - 35);
          ctx.lineTo(build.x + 34, build.y - 35);
          ctx.closePath();
          ctx.fill();
        }
        // 绘制升级状态
        if (build.isUping) {
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.strokeStyle = factionColor[build.faction];
          ctx.arc(
            build.x + 44,
            build.y - 45,
            10,
            0,
            ((this.frame[0] % 36) * 10 * Math.PI) / 180
          );
          ctx.stroke();
        }
      });
    },
    // 绘制人口比例条
    drawPopulationBar() {
      let startx = 50,
        starty = 680;
      let tempArr = Object.values(this.LGRT.users).filter(user => {
        if (user.idx) {
          return user;
        }
      });
      let arrlenght = tempArr.length;
      for (let i = 0; i < arrlenght; i++) {
        let user = tempArr[i];
        if (user.faction != Faction.Gray) {
          let userFR = Object.values(user.buildList).reduce((tlt, build) => {
            return build.level * 10 + tlt;
          }, 0);
          let lang = Math.round(
            (userFR / this.LGRT.totalPopulation) * this.barWidth
          );
          ctx.strokeStyle = "#999";
          ctx.lineWidth = 20;
          ctx.beginPath();
          ctx.moveTo(startx - 2, starty);
          ctx.lineTo(startx + lang + 2, starty);
          ctx.stroke();
          ctx.closePath();
          ctx.strokeStyle = factionColor[user.faction];
          ctx.lineWidth = 18;
          ctx.beginPath();
          ctx.moveTo(startx, starty);
          ctx.lineTo(startx + lang, starty);
          ctx.stroke();
          ctx.closePath();
          startx = startx + lang;
          if (lang == this.barWidth) {
            window.cancelAnimationFrame(this.drawTimer);
            this.LGRT.gameOver(user);
            this.$emit("gameOver", user);
            break;
          }
        }
      }
    },
    // 绘制士兵
    drawSolders() {
      // 士兵当前精灵图剪切位置计算公式（由精灵图决定）
      // x = (vector * 8 + c) % col  * w  // 第几列*单个width
      // y = (vector * 8 + c) / col  * h  // 第几行*单个heihgt
      // 获取帧数
      Object.values(this.LGRT.actionSoldier).forEach(solder => {
        if (solder.type == "Cavalry") {
          // 计算精灵图剪切偏移量
          let pos0 = this.calcCoordinate(
            solder.vector,
            this.frame[0],
            solderSprite.cavalry.col,
            solderSprite.cavalry.w,
            solderSprite.cavalry.h
          );
          let pos1 = this.calcCoordinate(
            solder.vector,
            this.frame[1],
            solderSprite.cavalry.col,
            solderSprite.cavalry.w,
            solderSprite.cavalry.h
          );
          let pos2 = this.calcCoordinate(
            solder.vector,
            this.frame[2],
            solderSprite.cavalry.col,
            solderSprite.cavalry.w,
            solderSprite.cavalry.h
          );
          // 绘制
          if (solder.health > 2) {
            ctx.drawImage(
              // 次
              this.solderImgList[`${solder.type}_${solder.faction}`],
              pos0.left,
              pos0.top,
              solderSprite.cavalry.w,
              solderSprite.cavalry.h,
              solder.x - solderSprite.cavalry.w / 2 - 16,
              solder.y - solderSprite.cavalry.w / 2 - 8,
              solderSprite.cavalry.w,
              solderSprite.cavalry.h
            );
          }
          if (solder.health > 1) {
            ctx.drawImage(
              // 次
              this.solderImgList[`${solder.type}_${solder.faction}`],
              pos1.left,
              pos1.top,
              solderSprite.cavalry.w,
              solderSprite.cavalry.h,
              solder.x - solderSprite.cavalry.w / 2 + 16,
              solder.y - solderSprite.cavalry.w / 2 - 8,
              solderSprite.cavalry.w,
              solderSprite.cavalry.h
            );
          }
          if (solder.health == 1) {
            ctx.drawImage(
              // 旗
              this.solderImgList[`${solder.type}_${solder.faction}_flag`],
              pos2.left,
              pos2.top,
              solderSprite.cavalry.w,
              solderSprite.cavalry.h,
              solder.x - solderSprite.cavalry.w / 2,
              solder.y - 32,
              solderSprite.cavalry.w,
              solderSprite.cavalry.h
            );
          }
        } else {
          // 计算精灵图剪切偏移量
          let pos0 = this.calcCoordinate(
            solder.vector,
            this.frame[0],
            solderSprite.no_cavalry.col,
            solderSprite.no_cavalry.w,
            solderSprite.no_cavalry.h
          );
          let pos1 = this.calcCoordinate(
            solder.vector,
            this.frame[1],
            solderSprite.no_cavalry.col,
            solderSprite.no_cavalry.w,
            solderSprite.no_cavalry.h
          );
          let pos2 = this.calcCoordinate(
            solder.vector,
            this.frame[2],
            solderSprite.no_cavalry_flag.col,
            solderSprite.no_cavalry_flag.w,
            solderSprite.no_cavalry_flag.h
          );
          // 绘制
          ctx.drawImage(
            // 次
            this.solderImgList[`${solder.type}_${solder.faction}`],
            pos0.left,
            pos0.top,
            solderSprite.no_cavalry.w,
            solderSprite.no_cavalry.h,
            solder.x - solderSprite.no_cavalry.w / 2 - 16,
            solder.y - solderSprite.no_cavalry.w / 2 - 8,
            solderSprite.no_cavalry.w,
            solderSprite.no_cavalry.h
          );
          ctx.drawImage(
            // 次
            this.solderImgList[`${solder.type}_${solder.faction}`],
            pos1.left,
            pos1.top,
            solderSprite.no_cavalry.w,
            solderSprite.no_cavalry.h,
            solder.x - solderSprite.no_cavalry.w / 2 + 16,
            solder.y - solderSprite.no_cavalry.h / 2 - 8,
            solderSprite.no_cavalry.w,
            solderSprite.no_cavalry.h
          );
          ctx.drawImage(
            // 旗
            this.solderImgList[`${solder.type}_${solder.faction}_flag`],
            pos2.left,
            pos2.top,
            solderSprite.no_cavalry_flag.w,
            solderSprite.no_cavalry_flag.h,
            solder.x - solderSprite.no_cavalry_flag.w / 2,
            solder.y - solderSprite.no_cavalry_flag.h / 2,
            solderSprite.no_cavalry_flag.w,
            solderSprite.no_cavalry_flag.h
          );
        }
      });
    },
    // 绘制死亡了的士兵血迹
    drawBlood() {
      Object.values(this.LGRT.deadSoldier).forEach(blood => {
        // ctx.save();
        // ctx.translate(blood.ex,blood.ey);
        // ctx.rotate(Math.floor(Math.random()*360)*Math.PI/180);
        ctx.drawImage(
          this.bloodImgList[`blood_0${blood.health}`],
          0,
          0,
          24,
          24,
          blood.ex,
          blood.ey,
          24,
          24
        );
        // ctx.restore();
      });
    },
    // 计算偏移量
    calcCoordinate(v, c, col, w, h) {
      let left = ((v * 8 + (c % 8)) % col) * w;
      let top = Math.floor((v * 8 + (c % 8)) / col) * h + 4;
      return {
        left,
        top,
      };
    },
    // 绘制选中/悬停状态
    drawBuildSelect() {
      Object.values(this.LGRT.buildList).forEach(build => {
        if (build.selected || build.hover) {
          build.isPlayer
            ? ctx.drawImage(
                this.ourSelectImg,
                build.x - 54,
                build.y - 66,
                112,
                112
              )
            : ctx.drawImage(
                this.enemySelectImg,
                build.x - 54,
                build.y - 66,
                112,
                112
              );
        }
      });
    },
    // 绘制UI
    drawUI() {
      ctx.drawImage(this.uiImg, 512, 0, 256, 128, 0, 0, 224, 112);
      ctx.drawImage(this.uiImg, 768, 0, 256, 128, 1142, 0, 224, 112);
    },
    // 循环绘制
    draw() {
      this.clearCanvas();
      this.drawRoads();
      this.drawBlood();
      if (Object.keys(this.LGRT.actionSoldier).length) {
        this.drawSolders();
      }
      this.drawBuilds();
      this.drawBuildSelect();
      this.drawPopulationBar();
      this.drawUI();
      if (this.count % 2 == 0) {
        this.frame[0]++;
        this.frame[1]++;
        this.frame[2]++;
      }
      this.count++;
      if (this.LGRT.status == "start") {
        this.drawTimer = window.requestAnimationFrame(this.draw);
      }
    },
  },
};
</script>
<style lang="scss">
.draw-canvas {
  width: 1366px;
  height: 700px;
}
</style>

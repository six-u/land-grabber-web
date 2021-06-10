import {
  Faction,
  BuildType
} from "../enum"

import {iMain} from "../interface/imain"
import {iBuild} from "../interface/ibuild"
import { iSoldier } from "../interface/isoldier";
import Audio from "../../audio/index"

// 定义建筑类
export default class Build implements iBuild {
  timer: number = -1; // 计时器id
  isUping: boolean = false;
  hover: boolean = false;
  selected: boolean = false;
  upTimer: number = 0;
  private count: number = 0;
  constructor(
    public idx: string,
    public width: string,
    public height: string,
    public x: number,
    public y: number,
    public type: BuildType,
    public faction: Faction,
    public defence: number,
    public population: number,
    public level: number,
    public isPlayer: boolean = false) {}
  /**
   * 建筑升级
   */
  levelUp(lgrt: iMain): void{
    if (this.level >= 5) return
    Audio.soundEffectPlay("uplevel")
    this.population = this.population - Math.ceil(this.level * 5)
    this.isUping = true
    this.upTimer = window.setTimeout(() => {
      this.isUping = false
      this.level++
      if(this.type == BuildType.Tower){
        this.setTower(lgrt)
      }
    }, 5 * 1000)
  }
  /**
   * 建筑人口增长
   */
  populationGrowth(): void {
    if (this.population < this.level * 10 && !this.isUping) {
      this.population++
    }
  };
  /**
   * 人口超出建筑最大承载量时，人口根据建筑等级流失
   */
  populationLoss(): number {
    if (this.population > this.level * 10 && !this.isUping){
      let redundant = this.population - this.level * 10 //超载人口
      let index = 0
      switch (true) {
        case (redundant <= 30):
          index = 5
          break;
        case (redundant > 30 && redundant <= 40):
          index = 4
          break;
        case (redundant > 40 && redundant <= 50):
          index = 3
          break;
        case (redundant > 50 && redundant <= 70):
          index = 2
          break;
        case (redundant > 70 && redundant <= 100):
          index = 1
          break;
        default:
          index = 0
      }
      // 建筑等级越低，人口超载越多，则人口流失越快
      let reduceArr = [ // 帕多瓦数列
        // [21, 16, 12, 9, 7],
        // [16, 12, 9, 7, 5], // 人口减损更快
        [12, 9, 7, 5, 4],
        [9, 7, 5, 4, 3],
        [7, 5, 4, 3, 2],
        [5, 4, 3, 2, 2],
        [4, 3, 2, 2, 1],
        [3, 2, 2, 1, 1], // 第二项开始
        // [2, 2, 1, 1, 1] // 第一项开始
      ]
      let oldPopulation = this.population
      let tempPopulation:number = oldPopulation - reduceArr[index][this.level - 1]
      this.population = tempPopulation<this.level*10 ? this.level*10 : tempPopulation

      return tempPopulation<this.level*10 ? oldPopulation - this.level*10 : reduceArr[index][this.level - 1]
    }

    return 0
  };
  /**
   * 建筑出兵，每次一半
   */
  sendTroops(): number {
    // 每次出兵为人口的一半，向下取整
    let num = Math.floor(this.population / 2)
    this.population = this.population - num
    return num
  };
  /**
   * 接收本阵营士兵，直接变为人口
   */
  transferTroops(): void {
    this.population++
  };
  /**
   * 建筑受到攻击，战斗减员计算及陷落判定。
   */
  defendCity(soldier: iSoldier) {
    let temp = this.population - soldier.attack*Math.round(soldier.health/3)
    if(this.type == BuildType.Castle && this.count%4==0){
      temp++
    }
    this.count++
    if (temp > 0) {
      // 防守成功
      this.population = temp
      return 1
    } else {
      // 防守失败
      this.population = 0
      // 取消升级流程
      this.isUping = false
      window.clearTimeout(this.upTimer)
      return 0
    }
  };
  /**
   * 建筑收税，税 = 建筑等级 * 建筑人口比例-1，人口超过20才能收上来
   */
  levyTaxes(): number {
    let tax = 0
    if (!this.isUping) {
      tax = Math.floor(this.population / this.level / 10 * this.level) - 1
      tax = tax > 0 ? tax : 0
    }
    return tax
  };
  /**
   * 建筑被攻陷，改变阵营
   * @param faction 新的阵营类型
   */
  changeFaction(faction: Faction): void {
    this.faction = faction
  };
  /**
   * 等级变动重设防御塔
   * @param lgrt main类实例，游戏运行时主体
   */
  setTower(lgrt: iMain){
    if(this.timer != -1){
      this.stopTower()
    }
    let radius = lgrt.option.towerRadius[this.level]
    this.timer = window.setInterval(()=>{
      let soldierArr:iSoldier[] = Object.values(lgrt.actionSoldier)
      for(let i in soldierArr) {
        let soldier = soldierArr[i]
        if(soldier.faction != this.faction // 敌方士兵与本方防御塔碰撞
          && soldier.x > this.x - radius - 8
          && soldier.x < this.x + radius + 8
          && soldier.y > this.y - radius - 8
          && soldier.y < this.y + radius + 8
        ){
          Audio.soundEffectPlay("tower")
          soldier.beAttacked()
          return
        }
      }
    }, lgrt.option.towerTime[this.level])
  };
  /**
   * 停止防御塔攻击
   */
  stopTower(){
    window.clearInterval(this.timer)
  }
}
import {
  Faction,
  BuildType
} from "../enum"
import {iMain} from "./imain"
import {iSoldier} from "./isoldier"
import {iPosition, iSize, iIndex} from "./ibase"

// 定义build类的接口
export interface iBuild extends iIndex, iSize, iPosition {
  timer: number; // 计时器id
  faction: Faction; // 阵营
  readonly type: BuildType;
  population: number; // 人口
  level: number; // 建筑等级
  isUping: boolean; // 是否正在升级
  upTimer: number;
  selected: boolean; // 是否被选中
  hover: boolean; // 是否被鼠标悬浮
  isPlayer: boolean; // 是否玩家
  readonly defence: number; // 建筑防御力

  levelUp(lgrt: iMain): void; // 建筑升级
  populationGrowth(): void; // 人口增长
  populationLoss(): number; // 人口流失
  sendTroops(): number; // 出兵数量
  transferTroops(): void; // 屯兵
  defendCity(soldier: iSoldier): number; //守城
  levyTaxes(): number; // 收税
  changeFaction(faction: Faction): void; // 建筑改变阵营
  setTower(lgrt: iMain): void; // 设置防御塔定时器
  stopTower():void; // 停止防御塔计时器，停止攻击
}

export interface iBuildList {
  [idx: string] : iBuild
}
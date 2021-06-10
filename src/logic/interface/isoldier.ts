import {
  Faction,
  SoldierType
} from "../enum"
import {iPosition, iIndex} from "./ibase"

// 定义build类的接口
export interface iSoldier extends iPosition, iIndex {
  animateId: number; // 动画id
  faction: Faction; // 阵营
  type: SoldierType; // 士兵类型
  fx: number; // 士兵出发X坐标
  fy: number; // 士兵出发Y坐标
  ex: number; // 士兵被击杀X坐标
  ey: number; // 士兵被击杀Y坐标
  speed: number; // 士兵速度
  vector: number; // 方向索引
  moveType: number; // 0: X根据Y运动，1：y根据x运动
  waypoint: number[][] ; // 路径点数组[[x,y],[x,y]]
  alive: boolean; // 士兵存活
  health: number; // 血量
  readonly attack: number; // 士兵攻击力
  readonly defence: number; // 士兵防御力
  isPlayer: boolean;
  isPause: boolean;
  move(): void; // 移动
  stop(): void; // 停止运动
  beAttacked(): void // 士兵被防御塔攻击
}

export interface iSoldierList {
  [idx: string]: iSoldier
}
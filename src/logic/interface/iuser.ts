import {
  Faction
} from "../enum"
import {iBuildList} from "./ibuild"
import {iSoldierList} from "./isoldier"
import {iIndex} from "./ibase"
import {iAI} from "./iai"

export interface iUser extends iIndex{
  maxPopulation: number; // 最大人口数
  maxBuild: number; // 最大建筑数
  sendTroopNum: number; // 出兵数
  battleDamage: number; // 战损人数
  internalFriction: number; // 内耗人数
  isDeath: boolean; // 是否败亡
  faction: Faction; // 阵营
  population: number; // 人口
  tax: number; // 税收
  buildList: iBuildList; // 建筑列表
  soldierList: iSoldierList; // 在外士兵列表
  skills: Array < any > ; // 以解锁技能列表
  nowSkill: Array < any > ; // 当前关卡可用技能列表
  ai: iAI | null; // 非玩家AI挂载点
  readonly isPlayer: boolean; // 是否玩家
  demographic(): void; // 人口统计
  addSkills(skill: any | Array < any > ): void; // 添加以解锁技能
  setNowSkill(): void; // 当前关卡可用技能列表，最多四个，从skills中随机添加
}

export interface iUserList {
  [idx: string]: iUser
}
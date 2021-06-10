import {
  Faction
} from "../enum"

import {iMain} from "./imain"
import {iBuild, iBuildList} from "./ibuild"

export type iOrder = 'UT' |　'UP' | 'PO' | 'AT' | 'SU' | 'RE' | 'AS'
export type iAction = iOrder[]
export type iActionGroups = iAction[][]
export type iActionFn = {
  [key:string]: () => boolean
}

export interface iAI {
  faction: Faction // ai阵营
  lgrt: iMain // 运行时环境
  actionGroups: iActionGroups // 行动组列表
  actionFn: iActionFn // 行动方式
  actionAIBuild: iBuildList // 执行行动的建筑
  attackList: iBuildList // 攻击中的敌方建筑

  ratio: number // 人口暂全局比例
  haveCanUp: boolean // 是否有可升级建筑
  canUpList: iBuildList // 可升级建筑列表
  havaCanUpTower: boolean // 是否有可升级防御塔
  canUpTowerList: iBuildList // 可升级防御塔列表
  havaRuins: boolean // 是否有废墟建筑（人口只有满员的50%及一下）
  ruinsList: iBuildList // 废墟建筑列表
  haveOwnBuildNeedHelp: boolean // 是否有需要支援的己方建筑
  ownNeedHelpList: iBuildList // 需要支援的己方建筑列表

  neighbouringBuild: iBuildList // 接壤建筑列表
  hasNeighbouringTower: boolean // 是否有临接的防御塔
  neighbouringTower: iBuild // 临接的防御塔
  nearestEnemyBuild: iBuild // 距离最近的敌方建筑
  haveEasyAttackable: boolean // 是否有容易攻击的敌方建筑
  easyAttackBuild: iBuild // 容易攻击的敌方建筑列表
  haveAttackNeedHelp: boolean // 是否有需要支援的攻击
  attackNeedHelpList: iBuildList // 需要支援的攻击的建筑列表
}

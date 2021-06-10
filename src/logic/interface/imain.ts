import {
  Faction
} from "../enum"
import {
  iBuild,
  iBuildList
} from "./ibuild"
import {
  iUser
} from "./iuser"
import {
  iSoldier,
  iSoldierList
} from "./isoldier"
import {
  iPointList
} from "./ipoint"
import {
  iOption
} from "./ioption"

import {
  imapBuild,
  imapRoad,
  imapUser
} from "./imap"

//地图配置单个建筑配置类
export class mainUser {
  gray: iUser
  red: iUser
  yellow: iUser
  green: iUser
  blue: iUser
  constructor(
    gray: iUser,
    red: iUser,
    yellow: iUser,
    green: iUser,
    blue: iUser, ) {
    this.gray = gray
    this.red = red
    this.yellow = yellow
    this.green = green
    this.blue = blue
  }
}
// 结算数据
export interface iSettlementData{
  timeConsuming: number; // 耗时
  maxPopulation: number; // 最大人口数
  maxBuild: number; // 最大建筑数
  sendTroopNum: number; // 出兵数
  battleDamage: number; // 战损人数
  internalFriction: number; // 内耗人数
}
export type Status = "no-start" | "start" | "pause" | "success" | "fail"
// 主入口
export interface iMain {
  status: Status; // 状态
  winnerFaction: Faction; // 胜利者的阵营
  userSettlementData: iSettlementData; // 玩家结算数据
  winnerSettlementData: iSettlementData; // 胜利者结算数据
  users: mainUser; //阵营数据
  totalPopulation: number; // 总人口
  buildList: iBuildList; // 所有建筑
  pointList: iPointList; // 点信息
  roads: number[][]; // 所有建筑
  points: number[][]; // 道路交点
  matrix: number[][]; // 道路邻接矩阵
  option: iOption; // 配置信息
  actionBuild: iBuildList; // 活动建筑
  actionSoldier: iSoldierList; // 活动士兵
  deadSoldier: iSoldierList; // 防御塔消灭士兵
  init(userConfig: imapUser[], buildConfig: imapBuild[], roadConfig: imapRoad[], option:iOption): void; // 初始化
  start(): void; // 开始
  pause(): void; // 暂停
  gameOver(user: iUser): void;
  stop(): void; // 停止
  settle(user: iUser): void; // 结算
  setOption(): void; // 设置配置
  getOption(): void; // 获取配置
  createUser(userConfig: imapUser[]): void; // 创建角色（阵营）
  drawMap(builds: imapBuild[], roads: imapRoad[]): void; // 创建地图
  interactive(type: boolean, build: iBuild, actionBuild:iBuildList): boolean; // 交互
  createSoldier(target: iBuild, fromBuilds: iBuildList): void; // 创建士兵
  soldierDead(soldier: iSoldier): void; // 士兵被防御塔击杀
}
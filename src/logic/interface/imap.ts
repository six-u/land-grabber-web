import {
  Faction,
  BuildType
} from "../enum"

// 地图配置单个角色配置接口
export interface imapUser {
  faction: Faction,
  isPlayer: boolean,
  show: boolean
}

//地图配置单个建筑配置接口
export interface imapBuild {
  x: number,
  y: number,
  type: BuildType,
  faction: Faction,
  level: number
}

//地图配置单个建筑配置接口
export interface imapRoad {
  [index:number]: number,
  length: 4
}

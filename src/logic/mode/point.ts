import {Faction} from "../enum"
import {iPoint,iPointList} from "../interface/ipoint"
import {iBuild} from "../interface/ibuild"

// 定义建筑类
export default class Point implements iPoint {
  faction: Faction | null = null
  border: iPointList = {}
  build: iBuild = <iBuild>{}
  constructor(
    public idx: string, // 索引
    public x: number, // X坐标
    public y: number, // Y坐标
    public hasBuild: boolean = false,
  ){}
  /**
   * 获取邻接点索引列表
   */
  getAllBorderIndexList(): number[] {
    return []
  }
  /**
   * 获取邻接点非本方建筑索引列表，并排序
   * @param sort 排序方式： true: 人口升序；false：距离升序
   */
  getOtherBorderInexList(sort: boolean = true): number[] {
    return []
  }
}
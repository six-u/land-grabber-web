/**
ai分级：简单 Easy，普通 normal，困难 hard，[地狱 hell]
 */

import {
  BuildType,
  Faction,
  // BuildType
} from "./enum"
import {iMain} from "./interface/imain"
import {iBuild, iBuildList} from "./interface/ibuild"
import {iPoint, iPointList} from "./interface/ipoint"
import {iUser} from "./interface/iuser"
import {iAI, iOrder, iAction, iActionFn, iActionGroups} from "./interface/iai"
import { iSoldier } from "./interface/isoldier"

// 状态机
class AI implements iAI{
  faction: Faction
  lgrt: iMain
  user: iUser = <iUser>{}
  actionGroups: iActionGroups // 行动组列表
  actionFn: iActionFn // 行动方式，执行决策
  actionAIBuild: iBuildList = {} // 执行行动的建筑
  attackList: iBuildList = {} // 攻击中的敌方建筑

  ratio: number = 0 // 人口比例
  haveCanUp: boolean = false // 是否有可升级建筑
  canUpList: iBuildList = {} // 可升级建筑列表
  havaCanUpTower: boolean = false // 是否有可升级防御塔
  canUpTowerList: iBuildList = {} // 可升级防御塔列表
  havaRuins: boolean = false // 是否有废墟建筑（人口只有满员的10%及一下）
  ruinsList: iBuildList = {}  // 废墟建筑列表
  haveOwnBuildNeedHelp: boolean = false // 是否有需要支援的己方建筑
  ownNeedHelpList: iBuildList = {} // 需要支援的己方建筑列表

  neighbouringBuild: iBuildList = {} // 接壤建筑列表
  hasNeighbouringTower: boolean = false // 是否有临接的防御塔
  neighbouringTower: iBuild = <iBuild>{} // 临接的防御塔
  nearestEnemyBuild: iBuild = <iBuild>{} // 距离最近的敌方建筑
  haveEasyAttackable: boolean = false // 是否有容易攻击的敌方建筑
  easyAttackBuild: iBuild = <iBuild>{} // 容易攻击的敌方建筑列表
  haveAttackNeedHelp: boolean = false // 是否有需要支援的攻击
  attackNeedHelpList: iBuildList = {} // 支援的攻击的建筑列表

  constructor(faction: Faction, lgrt: iMain){
    this.faction  = faction
    this.lgrt = lgrt
    // 升塔UT，升级UP,打塔PO,进攻AT,支援SU,救援RE,集结AS
    this.actionGroups = [
      [// 简单
        ['UT', 'UP', 'RE', 'PO', 'SU', 'AT', 'AS'], // 本阵营人口占总人口比例低于30
        ['UT', 'UP', 'RE', 'PO', 'SU', 'AT', 'AS'], // 本阵营人口占总人口比例低于60
        ['UT', 'UP', 'RE', 'PO', 'SU', 'AT', 'AS'], // 本阵营人口占总人口比例低于90
        ['UT', 'UP', 'RE', 'PO', 'SU', 'AT', 'AS']  // 本阵营人口占总人口比例大于等于90
      ],
      [// 普通
        ['UT', 'UP', 'RE', 'PO', 'SU', 'AT', 'AS'],
        ['UT', 'UP', 'RE', 'PO', 'SU', 'AT', 'AS'],
        ['UT', 'PO', 'AT', 'UP', 'RE', 'SU', 'AS'],
        ['UT', 'PO', 'AT', 'UP', 'RE', 'SU', 'AS']
      ],
      [// 困难
        ['UT', 'UP', 'RE', 'PO', 'SU', 'AT', 'AS'],
        ['PO', 'UT', 'UP', 'RE', 'AT', 'SU', 'AS'],
        ['UT', 'RE', 'PO', 'AT', 'SU', 'UP', 'AS'],
        ['UT', 'RE', 'PO', 'AT', 'SU', 'UP', 'AS']
      ],
      [// 地狱（暂无）
        ['UT', 'UP', 'RE', 'PO', 'SU', 'AT', 'AS'],
        ['PO', 'UT', 'AT', 'UP', 'RE', 'SU', 'AS'],
        ['PO', 'UT', 'AT', 'RE', 'SU', 'UP', 'AS'],
        ['PO', 'UT', 'AT', 'RE', 'SU', 'UP', 'AS']
      ],
    ]
    this.actionFn = {
      // 升塔
      UT: () =>{
        if(this.havaCanUpTower){
          // 防御塔人口降序
          let towerArr: iBuild[] = Object.values(this.canUpTowerList).sort((a,b)=>{
            if(a.population < b.population) {
              return 1
            }else if(a.population > b.population){
              return -1
            }else{
              return 0
            }
          })
          console.log("  ",this.faction, "升级防御塔")
          return this.up(towerArr[0]) ? true : false
        }
        return false
      },
      // 升级
      UP: ()=>{
        if(this.haveCanUp){
          // 先根据人口比例排序，然后根据人口数量排序 降序
          let buildArr: iBuild[] = Object.values(this.canUpList).sort((a,b)=>{
            if(a.population/a.level*10 < b.population/b.level*10){
              return 1
            }else if(a.population/a.level*10 > b.population/b.level*10){
              return -1
            }else{
              if(a.population < b.population){
                return 1
              }else if (a.population > b.population){
                return -1
              }else{
                return 0
              }
            }
          })
          console.log("  ",this.faction, "升级建筑")
          this.analysisSelf()
          return this.up(buildArr[0]) ? true : false
        }else{
          return false
        }
      },
      // 打塔
      PO: ()=>{
        if(this.hasNeighbouringTower
          && this.user.population >= this.neighbouringTower.population*4){
          console.log("  ",this.faction, "打塔")
          this.attackList[this.neighbouringTower.idx] = this.neighbouringTower // 记录被攻击建筑
          return this.attack(this.neighbouringTower,this.actionAIBuild)
        }else{
          return false
        }
      },
      // 进攻
      AT: ()=>{
        if(this.haveEasyAttackable){
          console.log("  ",this.faction, "进攻易进攻")
          this.attackList[this.easyAttackBuild.idx] = this.easyAttackBuild // 记录被攻击建筑
          return this.attack(this.easyAttackBuild,this.actionAIBuild)
        }else if(this.user.population>this.nearestEnemyBuild.population){
          console.log("  ",this.faction, "进攻最近")
          this.attackList[this.nearestEnemyBuild.idx] = this.nearestEnemyBuild // 记录被攻击建筑
          return this.attack(this.nearestEnemyBuild,this.actionAIBuild)
        }else{
          return true
        }
      },
      // 支援攻击
      SU: ()=>{
        if(this.haveAttackNeedHelp){
          console.log("  ",this.faction, "支援")
          for(let idx in this.attackNeedHelpList){
            let build: iBuild = this.attackNeedHelpList[idx]
            let result: boolean = this.attack(build,this.actionAIBuild)
            if(result){
              return true
            }
          }
          return false
        }else{
          return false
        }
      },
      // 救援
      RE: ()=>{
        if(this.havaRuins){
          console.log("  ",this.faction, "救援 ruins")
          let temp = Object.values(this.ruinsList)[0]
          return this.move(temp,this.actionAIBuild)
        }else if(this.haveOwnBuildNeedHelp){
          console.log("  ",this.faction, "救援 need help")
          let temp = Object.values(this.ownNeedHelpList)[0]
          return this.move(temp,this.actionAIBuild)
        }else{
          return false
        }
      },
      // 集结
      AS: ()=>{
        console.log("  ",this.faction, "集结(未执行操作)")
        // TODO: 集结逻辑
          return false
        // }
      },
    }
  }

  /**
   * <----------------------最终执行命令----------------------
   */
  /**
   * 升级操作
   */
  private up(target: iBuild):boolean {
    target.levelUp(this.lgrt)
    return true
  }
  /**
   * 攻击操作
   */
  private attack(target: iBuild,from: iBuildList):boolean {
    this.lgrt.createSoldier(target, from)
    return true
  }
  /**
   * 调兵操作
   */
  private move(target:iBuild, from: iBuildList):boolean {
    this.lgrt.createSoldier(target, from)
    return true
  }
  /**
   * ---------------------最终执行命令----------------------->
   */

  /**
   * 运行AI
   */
  run(){
    Object.values(this.attackList).forEach((build: iBuild) => {
      // 攻下敌方城市，将其从攻击列表中去除
      if(build.faction == this.faction){
        delete this.attackList[build.idx]
      }
    })
    this.intelligenceGathering()
    this.policyDecision()
  }
  /**
   * 获取接壤建筑列表
   * @param pointList 地图节点列表
   * @param buildList 所有建筑列表
   * @param faction 本阵营旗帜
   * @returns neighbouringBuild 接壤建筑列表
   */
  private getNeighbouring(pointList: iPointList,buildList: iBuildList,faction: Faction): iBuildList {
    let neighbouringBuild: iBuildList = {}
    // 循环本阵营建筑
    Object.values(buildList).forEach(build =>{
      let borderArr: iPoint[] = Object.values(pointList[build.idx].border)
      let arrivedIdxArr: string[] = []
      let deep = (arr: iPoint[]) => {
        // 循环本阵营建筑的邻接点
        arr.forEach(point=>{
          // 邻接点有敌方建筑
          if(point.hasBuild && point.faction!=faction){
            // 记录敌方建筑
            neighbouringBuild[point.idx] = point.build
          }
          // 邻接点无建筑
          if(!point.hasBuild && !arrivedIdxArr.includes(point.idx)){
            arrivedIdxArr.push(point.idx)
            let borderArrInner = Object.values(point.border)
            // 递归
            deep(borderArrInner)
          }
        })
      }
      deep(borderArr)
    })
    Object.values(neighbouringBuild).forEach((build:iBuild)=>{
      // 记录是否有邻接的敌方防御塔
      if(build.type == BuildType.Tower && this.user.population > build.population*this.lgrt.option.difficulty){
        this.hasNeighbouringTower = true
        this.neighbouringTower = build
      }
    })
    return neighbouringBuild
  }
  /**
   * 情报收集
   */
  private intelligenceGathering(){
    this.neighbouringBuild = this.getNeighbouring(this.lgrt.pointList, this.actionAIBuild, this.faction)
    this.analysisSelf()
    this.analysisEnemy()
    this.comparisonStrength()
  }
  /**
   * 分析自己
   */
  private analysisSelf() {
    this.actionAIBuild = {} // 行动建筑
    this.haveCanUp = false // 是否有可升级建筑
    this.canUpList = {} // 可升级建筑列表
    this.havaCanUpTower = false // 是否有可升级防御塔
    this.canUpTowerList = {} // 可升级防御塔列表
    this.havaRuins = false // 是否有废墟
    this.ruinsList = {} // 废墟建筑列表
    this.haveOwnBuildNeedHelp = false // 是否有需要支援的己方建筑
    this.ownNeedHelpList = {} // 需要支援的己方建筑列表
    Object.values(this.user.buildList).forEach(build=>{
      /**
       * ——————————检测己方可出兵建筑————————————————
       */
      if(build.level*8 == build.population  // 建筑人口满80%
        && build.level>=5-this.lgrt.option.difficulty // 达到一定等级
        && build.type !== BuildType.Tower){ // 不为防御塔
        this.actionAIBuild[build.idx] = build
      }
      // 阵营建筑数小于3个，则均可以发兵。
      if(Object.values(this.user.buildList).length<3
        && build.type !== BuildType.Tower){
        this.actionAIBuild[build.idx] = build
      }
      /**
       * —————————————————————————————————————————
       */
      // 有废墟 人口小于10%
      if(build.population <= build.level*2){
        this.havaRuins = true
        this.ruinsList[build.idx] = build
      }
      // 防御塔人口小于41救援
      if(build.type == BuildType.Tower && build.population<41){
        this.havaRuins = true
        this.ruinsList[build.idx] = build
        this.haveOwnBuildNeedHelp = true
        this.ownNeedHelpList[build.idx] = build
      }
      // 有需要支援的己方建筑 简单20%以下，普通30%以下，困难40%以下
      if(build.population<= build.level*(this.lgrt.option.difficulty+1)){
        this.haveOwnBuildNeedHelp = true
        this.ownNeedHelpList[build.idx] = build
      }
      // 可升级建筑
      if(!build.isUping  // 未在升级中
        && build.level*5 < build.population // 人口达到升级标准，满员的一半
        && build.level!=5 // 不是顶级
        && build.type != BuildType.Tower // 不是防御塔
      ){
        this.haveCanUp = true
        this.canUpList[build.idx] = build
      }
      // 排除防御塔剩下的建筑
      let tempBuildArr = Object.values(this.user.buildList)
      // let tempPopulation = 0
      tempBuildArr.forEach((build,i)=>{
        // tempPopulation += build.population
        if(build.type == BuildType.Tower){
          tempBuildArr.splice(i,1)
        }
      })
      // 是否有需要升级的防御塔
      if(!build.isUping
        && build.type == BuildType.Tower // 是防御塔
        && tempBuildArr.length > 0 //除防御塔外，己方还有其他建筑至少1个
        && build.level*(5+this.lgrt.option.difficulty) <= build.population // 人口达到升级标准，随难度增加
        && build.level != 5 // 未满级
      ){
        this.havaCanUpTower = true
        this.canUpTowerList[build.idx] = build
      }
    })
    /**
     * ——————————检测己方可出兵建筑————————————————
     */
    let len:number = Object.keys(this.actionAIBuild).length, ubLen:number = Object.values(this.user.buildList).length
    Object.values(this.user.buildList).forEach(build=>{
      if(build.type != BuildType.Tower){
        if(ubLen==1){
          if(build.population==50){
            this.actionAIBuild[build.idx] = build
          }
        }else{
          if(len == 0 // 没有满级满员的建筑
            && build.population >= build.level*(10-this.lgrt.option.difficulty)
            && build.level>=5-this.lgrt.option.difficulty // 人口大于一定比例也加入行动建筑建筑
          ){
            this.actionAIBuild[build.idx] = build
          }
        }
      }
    })
  }
  /**
   * 分析敌人
   */
  private analysisEnemy() {
    this.nearestEnemyBuild = <iBuild>{} // 距离最近的敌方建筑
    this.haveEasyAttackable = false // 是否有容易攻击的敌方建筑
    this.easyAttackBuild = <iBuild>{} // 容易攻击的敌方建筑列表
    this.haveAttackNeedHelp = false // 是否有需要支援的攻击
    this.attackNeedHelpList = {} // 支援的攻击的建筑列表

    // 最近的敌方建筑
    let temp = this.getShortest()
    this.nearestEnemyBuild = temp.enamyBuild

    // 临接敌方建筑人口升序
    let tempEasy = Object.values(this.neighbouringBuild).sort((a,b)=>{
      if(a.population>b.population){
        return 1
      }else if(a.population<b.population){
        return -1
      }else{
        return 0
      }
    })

    // 总人口大于邻接建筑人口 且 临接最少人口与难度为以下关系判为易攻
    if(tempEasy[0]?.population<=this.lgrt.option.difficulty*5+5
      && this.user.population/2 >= tempEasy[0].population){
      this.haveEasyAttackable = true
      this.easyAttackBuild = tempEasy[0]
    }else{
      this.haveEasyAttackable = false
    }
    // 是否有需要攻击支援的建筑
    Object.values(this.attackList).forEach((build: iBuild) => {
      let soldierNum = 0
      Object.values(this.user.soldierList).forEach((soldier: iSoldier)=>{
        let target: number[] = soldier.waypoint[soldier.waypoint.length-1]
        if(target[0] == build.x && target[1]== build.y){
          soldierNum++
        }
      })
      // 发往目标建筑的士兵小于目标建筑人口+5+难度，视为应该支援
      if(soldierNum <= build.population+5+this.lgrt.option.difficulty){
        this.haveAttackNeedHelp = true
        this.attackNeedHelpList[build.idx] = build
      }
      // 及时止损，防止AI死命的支援一个打不下来的目标
      if(soldierNum==0){
        this.haveAttackNeedHelp = false
        this.attackNeedHelpList = {}
      }
    })
  }
  /**
   * 获取最近的敌方建筑
   * 循环border
   * ——如果没有建筑，循环点的border
   * ————如果没有建筑，循环点的border
   * ————如果有己方建筑，保存距离和点
   * ——循环结束，返回最短的距离和点
   * ——保存内外部距离和内部点
   * ——如果有己方建筑，保存距离和点
   * —循环结束，比较距离，得出短的距离和点
   */
  private getShortest() {
    type TempDistence = {
      [key:number]:{
        distence: number,
        build: iBuild,
      }
    }
    // 根据临接的敌方建筑列表递归获取最近的乙方建筑及距离
    let doShort = (border:iPointList,idx: string, arrived: string[]) =>{
      let innerObj:TempDistence = {}
      arrived.push(idx)
      Object.values(border).forEach((point:iPoint,i:number)=>{
        innerObj[i] = {
          distence: 0,
          build: <iBuild>{}
        }
        if(point.hasBuild === false && !arrived.includes(point.idx)){
            innerObj[i].distence = this.lgrt.matrix[Number(idx)][Number(point.idx)]
            let temp = doShort(point.border,point.idx, arrived)
            innerObj[i].distence += temp.distence
            innerObj[i].build = temp.build
        }
        if(point.hasBuild && point.faction == this.faction){
          innerObj[i].distence = this.lgrt.matrix[Number(idx)][Number(point.idx)],
          innerObj[i].build = this.lgrt.buildList[point.idx]
        }
        // 去除非己方路径
        if(innerObj[i].distence == 0){
          innerObj[i].distence = Infinity
        }
      })
      let tempArr = Object.values(innerObj).sort((a,b)=>{
        if(a.distence>b.distence){
          return 1
        }else if(a.distence<b.distence){
          return -1
        }else{
          return 0
        }
      })
      return tempArr[0]
    }

    let obj: TempDistence = {}
    let idxArr = Object.keys(this.neighbouringBuild)
    // 获取邻接点数据
    let neighbouringPointArr: iPoint[] = Object.values(this.lgrt.pointList).filter((point:iPoint)=>idxArr.includes(point.idx))
    // 循环
    neighbouringPointArr.forEach((point:iPoint)=>{
      obj[Number(point.idx)] = {
        distence: 0,
        build: <iBuild>{}
      }
      let arivedArr: string[] = []
      let result = doShort(point.border,point.idx, arivedArr)
      obj[Number(point.idx)].distence = result.distence
      obj[Number(point.idx)].build = result.build
    })
    let result = {
      distence: Infinity, // 最短距离
      myBuild: <iBuild>{}, // 距敌方最近的己方建筑
      enamyBuild: <iBuild>{}, // 距己方最近的敌方建筑
    }
    for(let key  in obj){
      if(obj[key].distence< result.distence){
        result.distence = obj[key].distence
        result.myBuild = obj[key].build
        result.enamyBuild = this.lgrt.buildList[key]
      }
    }
    return result
  }
  /**
   * 实力对比
   */
  private comparisonStrength(){
    let myPopulation = this.user.population
    this.ratio = parseFloat((myPopulation*100 / this.lgrt.totalPopulation).toFixed(2))
  }
  /**
   * 取得执行命令类型，调用执行决策
   */
  private policyDecision(){
    let actionGroup: iAction = []
    // 人口占比不同，指令执行的优先级不同
    switch(true){
      case (this.ratio<30):
        actionGroup = [...this.actionGroups[this.lgrt.option.difficulty-1][0]]
        break;
      case (this.ratio<60):
        actionGroup = [...this.actionGroups[this.lgrt.option.difficulty-1][1]]
        break;
      case (this.ratio<90):
        actionGroup = [...this.actionGroups[this.lgrt.option.difficulty-1][2]]
        break;
      default:
        actionGroup = [...this.actionGroups[this.lgrt.option.difficulty-1][3]]
    }
    // 可执行指令次数由难度等级决定
    let count = this.lgrt.option.difficulty
    console.log(this.faction+' AI : { ')
    // console.log(actionGroup)
    while( count >0 ){
      for(let i in actionGroup){
        let order:iOrder = actionGroup[i]
        let result: boolean = this.actionFn[order]()
        // 执行成功
        if(result){
          // 避免重复执行
          actionGroup.splice(Number(i),1)
          break
        }
        this.intelligenceGathering()
      }
      count --
    }
    console.log('}')
  }
}

export default AI
import {
  BuildType,
  SoldierType,
  Faction
} from "./enum"
import AI from "./ai"
import Build from "./mode/build"
import Soldier from "./mode/soldier"
import User from "./mode/user"
import Point from "./mode/point"
import {iSettlementData, Status, iMain, mainUser} from "./interface/imain"
import {iBuild, iBuildList} from "./interface/ibuild"
import {iSoldier, iSoldierList} from "./interface/isoldier"
import {iPointList} from "./interface/ipoint"
import {iOption} from "./interface/ioption"
import {iUser} from "./interface/iuser"
import {
  imapBuild,
  imapUser,
  imapRoad
} from "./interface/imap"
import Audio from "../audio/index"

export default class LGRT implements iMain {
  status: Status = "no-start";
  winnerFaction: Faction = Faction.Red;
  userSettlementData: iSettlementData; // 玩家结算数据
  winnerSettlementData: iSettlementData; // 胜利者结算数据
  collideTimer: number = 0;
  rtTimer: number = 0;
  aiTimer: number = 0;
  clockTime: number = 0;
  playTimes: number = 0;
  users: mainUser;
  buildList: iBuildList = {};
  pointList: iPointList = {};
  roads: number[][] = [];
  points: number[][] = [];
  actionBuild: iBuildList = {};
  actionSoldier: iSoldierList = {};
  deadSoldier: iSoldierList = {};
  matrix: number[][] = [];
  option!: iOption;
  totalPopulation: number = 0;
  constructor(){
    this.setOption()
    this.users = new mainUser(<iUser>{},<iUser>{},<iUser>{},<iUser>{},<iUser>{})
    this.userSettlementData = {
      timeConsuming: 0, // 耗时
      maxPopulation: 0, // 最大人口数
      maxBuild: 0, // 最大建筑数
      sendTroopNum: 0, // 出兵数
      battleDamage: 0, // 战损人数
      internalFriction: 0, // 内耗人数
    }
    this.winnerSettlementData = {
      timeConsuming: 0, // 耗时
      maxPopulation: 0, // 最大人口数
      maxBuild: 0, // 最大建筑数
      sendTroopNum: 0, // 出兵数
      battleDamage: 0, // 战损人数
      internalFriction: 0, // 内耗人数
    }
  }
  /**
   * 开始运行
   */
  start() {
    this.status = "start"
    // 运行基础
    this.runTime()
    // 运行AI
    Object.values(this.users).forEach(user=>{
      user.ai && user.ai.run()
    })
    // 碰撞检测
    this.collideTimer =  window.setInterval(() => {
      this.collideCheck()
    }, 200)
    // 运行基础循环
    this.rtTimer = window.setInterval(() => {
      this.runTime()
    }, 1600)
    // 运行AI循环
    this.aiTimer = window.setInterval(() => {
      Object.values(this.users).forEach(user=>{
        user.ai && user.ai.run()
        // if()
      })
    }, 5000)
    // 运行计时器
    this.clockTime = window.setInterval(()=>{
      this.playTimes++
    },1000)
    Object.values(this.actionSoldier).forEach(soldier => {
      soldier.isPause = false
      if(this.status!='no-start'){
        soldier.move()
      }
    })
    Object.values(this.buildList).forEach(build => {
      if(build.type==BuildType.Tower){
        build.setTower(this)
      }
    })
  }
  /**
   * 暂停运行
   */
  pause() {
    this.status = "pause"
    window.clearInterval(this.collideTimer)
    window.clearInterval(this.rtTimer)
    window.clearInterval(this.aiTimer)
    window.clearInterval(this.clockTime)
    Object.values(this.actionSoldier).forEach(soldier => {
      soldier.isPause = true
      soldier.stop()
    })
    Object.values(this.buildList).forEach(build => {
      if(build.type==BuildType.Tower){
        build.stopTower()
      }
    })
  }
  /**
   * 游戏结束
   * @param user 胜利阵营
   */
  gameOver(user: iUser){
    this.stop()
    if(user.isPlayer){
      this.status = "success"
    }else{
      this.status = "fail"
    }
    this.settle(user)
  }
  /**
   * 停止运行
   */
  stop() {
    window.clearInterval(this.collideTimer)
    window.clearInterval(this.rtTimer)
    window.clearInterval(this.aiTimer)
    window.clearInterval(this.clockTime)
    Object.values(this.actionSoldier).forEach(soldier => {
      soldier.isPause = true
      soldier.stop()
    })
    Object.values(this.buildList).forEach(build => {
      if(build.type==BuildType.Tower){
        build.stopTower()
      }
    })
  }
  /**
   * 结算数据
   */
  settle(user: iUser) {
    let player:iUser = <iUser>{}
    this.winnerFaction = user.faction
    Object.values(this.users).filter(user=>{
      if(user.isPlayer){
        player = user
      }
    })
    this.userSettlementData = {
      timeConsuming: this.playTimes, // 耗时
      maxPopulation: player.maxPopulation, // 最大人口数
      maxBuild: player.maxBuild, // 最大建筑数
      sendTroopNum: player.sendTroopNum, // 出兵数
      battleDamage: player.battleDamage, // 战损人数
      internalFriction: player.internalFriction, // 内耗人数
    }
    this.winnerSettlementData = {
      timeConsuming: this.playTimes, // 耗时
      maxPopulation: user.maxPopulation, // 最大人口数
      maxBuild: user.maxBuild, // 最大建筑数
      sendTroopNum: user.sendTroopNum, // 出兵数
      battleDamage: user.battleDamage, // 战损人数
      internalFriction: user.internalFriction, // 内耗人数
    }
  }
  /**
   * 设置系统配置
   */
  setOption() {
    this.option = {
      difficulty: 1,
      towerRadius: {
        1: 80,
        2: 95,
        3: 110,
        4: 130,
        5: 150,
      },
      towerTime: {
        1: 800,
        2: 600,
        3: 420,
        4: 280,
        5: 120,
      }
    }
  }
  /**
   * 获取系统配置
   */
  getOption() {

  }
  /**
   * 初始化
   * @param userConfig 阵营配置对象
   * @param buildConfig 建筑配置对象
   * @param roadConfig 路径配置对象
   */
  init(userConfig: imapUser[], buildConfig: imapBuild[], roadConfig: imapRoad[], option?: iOption) {
    // 初始化数据
    this.status = "no-start";
    this.winnerFaction = Faction.Red;
    this.collideTimer = 0;
    this.rtTimer = 0;
    this.aiTimer = 0;
    this.clockTime = 0;
    this.playTimes = 0;
    this.buildList = {};
    this.pointList = {};
    this.roads = [];
    this.points = [];
    this.actionBuild = {};
    this.actionSoldier = {};
    this.deadSoldier = {};
    this.matrix = [];
    this.totalPopulation = 0;
    this.users = new mainUser(<iUser>{},<iUser>{},<iUser>{},<iUser>{},<iUser>{})
    this.userSettlementData = {
      timeConsuming: 0, // 耗时
      maxPopulation: 0, // 最大人口数
      maxBuild: 0, // 最大建筑数
      sendTroopNum: 0, // 出兵数
      battleDamage: 0, // 战损人数
      internalFriction: 0, // 内耗人数
    }
    this.winnerSettlementData = {
      timeConsuming: 0, // 耗时
      maxPopulation: 0, // 最大人口数
      maxBuild: 0, // 最大建筑数
      sendTroopNum: 0, // 出兵数
      battleDamage: 0, // 战损人数
      internalFriction: 0, // 内耗人数
    }
    // 载入配置
    if(option){
      this.option = option
    }
    // 创建阵营
    this.createUser(userConfig)
    // 初始化地图
    this.drawMap(buildConfig, roadConfig)
    console.log(this)
  }
  /**
   * 计时器运行方法
   */
  runTime() {
    Object.values(this.buildList).forEach((build: iBuild)=>{
      // 人口增长 流失
      if(!build.isUping){
        // 记录流失的人口
        this.users[build.faction].internalFriction += build.populationLoss()
      }
      if (build.type !== BuildType.Tower) {
        build.populationGrowth()
      }
      // 收税
      let tax = build.levyTaxes()
      this.users[<Faction>build.faction].tax += tax
    })
    Object.values(this.users).forEach(user=>{
      // 统计各阵营人口
      if(user.show){
        this.users[<Faction>user.faction].demographic()
      }
      // 败亡则清空AI
      if(!user.isPlayer && user.population == 0){
        user.ai = null
        user.isDeath = true
      }
    })
    // 统计总人口
    this.totalPopulation = Object.values(this.buildList).reduce((tlt,build)=>{
      // build.faction != Faction.Gray && (tlt+=(build.level*10))
      if(build.faction != Faction.Gray){
        return tlt+build.level * 10
      }else{
        return tlt
      }
    },0)
    // 士兵移动声音
    let hasArmor = Object.values(this.actionSoldier).some(v=>v.type == SoldierType.Armor)
    let hasCavalry = Object.values(this.actionSoldier).some(v=>v.type == SoldierType.Cavalry)
    let hasMilitia = Object.values(this.actionSoldier).some(v=>v.type == SoldierType.Militia)
    if(hasArmor){
      Audio.soundEffectPlay("Armor_go",true)
    }
    if(hasCavalry){
      Audio.soundEffectPlay("Cavalry_go",true)
    }
    if(hasMilitia){
      Audio.soundEffectPlay("Militia_go",true)
    }
  }
  /**
   * 碰撞检测
   */
  collideCheck() {
    // for(let idx in this.actionSoldier){
    //   let soldier = this.actionSoldier[idx],
    let actionSoldierArr = Object.values(this.actionSoldier)
    for (let slen = actionSoldierArr.length; slen > 0; slen--) {
      let soldier = actionSoldierArr[slen - 1],
        waypointLen = soldier.waypoint.length
      for (let len = Object.values(this.buildList).length; len > 0; len--) {
        let build = Object.values(this.buildList)[len - 1]
        // 不能和出发点相碰
        if (soldier.fx > build.x - 64 && soldier.fx < build.x + 64 && soldier.fy > build.y - 94 && soldier.fy < build.y + 30) {
          continue
        }
        // 和建筑相碰
        if (soldier.x >= build.x - 8 && soldier.x <= build.x + 8 && soldier.y >= build.y - 8 && soldier.y <= build.y + 8) {
          if (build.faction == soldier.faction) {
            // 路过己方城市不操作
            let sodlierTarget = soldier.waypoint[waypointLen - 1]
            if (sodlierTarget[0] == build.x && sodlierTarget[1] == build.y) {
              // 调兵到己方城市
              build.transferTroops()
              // 删除士兵
              delete this.actionSoldier[soldier.idx]
              delete this.users[soldier.faction].soldierList[soldier.idx]
              break
            }
          } else {
            // 攻击敌方城市
            Audio.soundEffectPlay(soldier.type + "_fight")
            let result: number = build.defendCity(soldier)
            if (result == 0) {
              Audio.soundEffectPause()
              console.log(soldier.faction, "进攻", build.faction, "位于", `(${build.x},${build.y}) 的`, build.type, '成功')
              if(soldier.isPlayer){
                Audio.soundEffectPlay('occupy')
              }else{
                Audio.soundEffectPlay('slump')
              }
              // 防守失败
              delete this.users[build.faction].buildList[build.idx]
              build.faction = soldier.faction
              this.pointList[build.idx].faction = soldier.faction
              build.isPlayer = soldier.isPlayer
              build.level = 1
              build.population = 0
              this.users[soldier.faction].buildList[build.idx] = build
            }
            // 记录战损人数
            this.users[soldier.faction].battleDamage++
            // 删除士兵
            delete this.actionSoldier[soldier.idx]
            delete this.users[soldier.faction].soldierList[soldier.idx]
            break
          }
        }
      }
    }
  }
  /**
   * 根据配置循环创建阵营
   * @param userConfig 阵营配置对象
   */
  createUser(userConfig: imapUser[]) {
    userConfig.forEach((user: imapUser, idx: number) => {
      if (user.show) {
        // 为非玩家创建AI
        let ai = !user.isPlayer && user.faction !== Faction.Gray ? new AI(user.faction, this) : null
        let temp = new User(idx.toString(), Boolean(user.show), user.faction + " country", user.faction, Boolean(user.isPlayer), ai)
        this.users[user.faction]  = temp
        if(ai){
          ai.user = temp
        }
      }
    })
  }
  /**
   * 根据配置创建建筑和路径
   * @param buildConfig 建筑配置对象
   * @param roadConfig 路径配置对象
   */
  drawMap(buildConfig: imapBuild[], roadConfig: imapRoad[]) {
    // 取得road交点
    this.points = this.getEndpoint(roadConfig)
    // 创建点信息
    this.points.forEach((p,i)=>{
      this.pointList[i] = new Point(i.toString(),p[0],p[1])
    })
    // 取得道路网邻接矩阵
    this.matrix = this.createAdjacencyMatrix(this.points, roadConfig)
    // 补充点的邻接点信息
    this.matrix.forEach((distenceArr,idx)=>{
      distenceArr.forEach((d,i)=>{
        if(d>0&&d<Infinity){
          this.pointList[idx].border[i] = this.pointList[i]
        }
      })
    })

    this.buildList = {}
    for (let len = buildConfig.length; len > 0; len--) {
      let config = buildConfig[len - 1]
      let defence: number = 1
      let pointIndex = this.getIndex([config.x, config.y], this.points)
      // 创建建筑
      let build = new Build(
        pointIndex.toString(),
        "128px",
        "128px",
        config.x,
        config.y,
        config.type,
        config.faction,
        defence,
        config.level * 10,
        config.level,
        this.users[config.faction].isPlayer
      )
      this.buildList[pointIndex] = build
      this.users[config.faction].buildList[pointIndex] = build
      this.pointList[pointIndex].build = build
      this.pointList[pointIndex].faction = build.faction
      this.pointList[pointIndex].hasBuild = true
    }
  }
  /**
   * 获取道路交点坐标
   * @param roadConfig 路径配置对象
   */
  private getEndpoint(roadConfig: imapRoad[]) {
    let points: number[][] = []
    // 所有出现的路径点
    roadConfig.forEach(v => {
      points.push([v[0], v[1]])
      points.push([v[2], v[3]])
    })
    // 去重
    for (let len1 = points.length; len1 > 0; len1--) {
      let out = points[len1 - 1]
      for (let len2 = len1 - 1; len2 > 0; len2--) {
        let inn = points[len2 - 1]
        if (out[0] == inn[0] && out[1] == inn[1]) {
          points.splice(len2 - 1, 1)
          len1--
        }
      }
    }
    return points
  }
  /**
   * 创建路径点邻接矩阵
   * @param points 所有路径点
   * @param roadConfig 道路配置
   */
  private createAdjacencyMatrix(points: number[][], roadConfig: imapRoad[]): number[][] {
    let adjacencyMatrix: number[][] = []
    points.forEach((pointOuter, indexOuter) => {
      // pointOuter的加权临接数组，权为距离
      let outerDistence: number[] = []
      // 查找连接点数组
      let lineToPoints: number[][] = this.getNearPoints(pointOuter[0], pointOuter[1], roadConfig)
      points.forEach((pointInner, indexInner) => {
        if (pointOuter[0] == pointInner[0] && pointOuter[1] == pointInner[1]) {
          outerDistence[indexInner] = 0 // 自己
        } else {
          outerDistence[indexInner] = this.calcDistance(pointOuter, pointInner, lineToPoints, this.buildList)
        }
      })
      adjacencyMatrix[indexOuter] = outerDistence
    })
    return adjacencyMatrix
  }
  /**
   * 查找路径中与该点相连的点
   * @param x 终点x坐标
   * @param y 终点y坐标
   * @param roadConfigy 路径配置对象
   */
  private getNearPoints(x: number, y: number, roadConfig: imapRoad[]): number[][] {
    let temp = []
    for (let len = roadConfig.length; len > 0; len--) {
      let road = roadConfig[len - 1]
      if (x == road[0] && y == road[1]) {
        temp.push([road[2], road[3]])
      }
      if (x == road[2] && y == road[3]) {
        temp.push([road[0], road[1]])
      }
    }
    return temp
  }
  /**
   * 计算端点距离，道路配置存在的路径得出路径长度，不存在则返回Infinite
   * @param start 起点坐标
   * @param end 终点坐标
   * @param tempPoints 有效（配置中存在的）终点列表
   * @param buildList 建筑集合
   */
  private calcDistance(start: number[], end: number[], tempPoints: number[][], buildList: iBuildList): number {
    let flag: number = 0, // 是否相邻
      temp: number[] = [], // 相邻点坐标
      [startx, starty] = start,
      [endx, endy] = end
    // 1.判断路径是否相邻
    tempPoints.forEach(v => {
      if (endx == v[0] && endy == v[1]) {
        flag = 1
        temp = v
      }
    })
    if (flag == 1) { //相邻
      return Math.round(Math.sqrt((temp[0] - startx) ** 2 + (temp[1] - starty) ** 2));
    } else {
      return Infinity // 不相邻
    }
  }
  /**
   * 交互处理，处理单击双击
   */
  interactive(type: boolean, build: Build, actionBuild:iBuildList): boolean {
    if (build.isPlayer && type) { // 点击的是player建筑，并且是单击
      console.log('player 选中己方位于', `(${build.x},${build.y}) 的`, build.type )
      actionBuild[build.idx] = build
      return false
    } else { // 点击的不是player建筑，或者点击的是player建筑并且是双击击
      this.createSoldier(build, actionBuild)
      return true
    }
  }
  /**
   * 生成士兵
   * @param build 目标建筑
   */
  createSoldier(build: Build, actionBuild: iBuildList) {
    Object.values(actionBuild).forEach(fromBuild => {
      if (fromBuild.idx != build.idx) {
        // 取得可通行的最短路径
        let waypoints = this.getShortestPath(fromBuild, build)
        if (!waypoints.length) {
          // 没有到达的道路，不创建士兵
          fromBuild.selected = false
          console.log('player 想攻击', build.faction, '位于', `(${build.x},${build.y}) 的`, build.type, "但没有可到达的道路" )
          return
        }
        // 获取可派兵数量
        let num = fromBuild.sendTroops()
        // 确认士兵类型及其数值
        let soldierT = SoldierType.Militia
        let speed = 1,
          attack = 1,
          defence = 1
        if (fromBuild.type == BuildType.Stable) {
          soldierT = SoldierType.Cavalry
          speed = 2
        }
        if (fromBuild.type == BuildType.Arsenal) {
          soldierT = SoldierType.Armor,
            attack = 2
        }

        const doCreate = () => {
          // 推入全局存储
          let idx = Date.now().toString(36)
          let soldier = new Soldier(
              idx,
              fromBuild.x,
              fromBuild.y,
              soldierT,
              fromBuild.isPlayer,
              speed,
              attack,
              defence,
              fromBuild.faction,
              waypoints,
              this
            )
          this.actionSoldier[idx] = soldier
          this.users[fromBuild.faction].soldierList[idx] = soldier
          num--
          // fromBuild.sendTroopOne()
          if (num > 0) {
            setTimeout(() => {
              doCreate()
            }, fromBuild.type == BuildType.Stable ? 120 : 240)
          }else{
            actionBuild[fromBuild.idx] == undefined
          }
        }
        doCreate();
        // 记录出兵敌方的数量
        if(fromBuild.faction != build.faction){
          this.users[fromBuild.faction].sendTroopNum += num
        }
        console.log("——",fromBuild.faction,'的', `${fromBuild.type}(${fromBuild.x},${fromBuild.y}) 派兵前往`, build.faction, '的', `${build.type}(${build.x},${build.y})`)
      }
      fromBuild.selected = false
    })
    let fristBuild:iBuild = Object.values(actionBuild)[0]
    if(fristBuild && this.users[fristBuild.faction].isPlayer){
      this.unSelect()
    }
  }

  /**
   * 根据起始点计算最短路径，依赖roadConfig路径配置对象
   * @param x1 起始点x坐标
   * @param y1 起始点y坐标
   * @param x2 结束点x坐标
   * @param y2 结束点y坐标
   */
  private getShortestPath(fromBuild: iBuild, target: iBuild) {
    // 获取所有路径列表
    // let x1 = fromBuild.x, y1= fromBuild.y,
    //     x2 = target.x, y2 = target.y
    let allPath: number[][] = this.getAllPath(fromBuild, target)
    // 根据路径长度倒序
    let sortAllPath: number[][] = this.sortPath(allPath)
    // 取得可用的最短路径
    let availableShortPath: number[][] = this.getAvailablePointPath(sortAllPath, fromBuild)
    return availableShortPath
  }
  /**
   * 获取两点间的所有路径
   * @param start 起始路径点
   * @param end 借宿路径点
   */
  private getAllPath(fromBuild: iBuild, target: iBuild) {
    // 初始化所有路径数组
    let start = [fromBuild.x,fromBuild.y], end = [target.x, target.y]
    let allPath: number[][] = []
    // 初始化主栈
    // 初始化辅栈
    let mainArr: number[] = []
    let subArr: number[][] = []

    // 获取邻接点索引数组
    function getNearIndexArr(pointIdx: number, AM: number[][]): number[] {
      let temp: number[] = []
      AM[pointIdx].forEach((v: number, i: number) => {
        if (v > 0 && v < Infinity && !mainArr.includes(i)) {
          temp.push(i)
        }
      })
      return temp
    }
    // 获取结束点索引
    let endIndex = this.getIndex(end, this.points)
    // 首次建栈
    mainArr.push(this.getIndex(start, this.points))
    subArr.push(getNearIndexArr(this.getIndex(start, this.points), this.matrix))
    // 主栈顶仍有邻接点
    while (mainArr.length) {
      // 获取辅栈栈顶，为邻接节点列表,注：使用pop已消除辅栈栈顶
      let temp: number[] = subArr.pop() || []
      // F 邻接节点列表不为空 THEN
      if (temp.length) {
        // 获取邻接节点列表首个邻接点索引
        let first = temp.shift()
        // 将第一个邻接点压入主栈，剩下的邻接点仍压回辅栈
        // 建栈
        mainArr.push( < number > first)
        subArr.push(temp)
        // 获取first的邻接点，排除已在主栈存在的点，压入辅站
        let near = [...getNearIndexArr( < number > first, this.matrix)]
        subArr.push(near)
      } else {
        // 销栈
        mainArr.pop()
      }
      let len = mainArr.length
      if (mainArr[len - 1] == endIndex) {
        allPath.push([...mainArr])
        mainArr.pop()
        subArr.pop()
      }
    }
    return allPath
  }
  /**
   * 获取点索引
   * @param point 点坐标
   * @param points 点列表
   */
  private getIndex(point: number[], points: number[][]): number {
    let idx = 0
    points.forEach((v: number[], i: number) => {
      if (point[0] == v[0] && point[1] == v[1]) {
        idx = i
      }
    })
    return idx
  }
  /**
   * 根据路径长度排序
   * @param array 所有路径的路径点索引列表
   */
  private sortPath(array: number[][]): number[][] {
    const sort = (arr: number[][], left: number = 0, right: number = arr.length - 1) => {
      if (left >= right) {
        //如果左边的索引大于等于右边的索引说明整理完毕
        return;
      }
      let i: number = left;
      let j: number = right;
      const baseVal: number = this.calcRoadDistance(arr[j]); // 取无序数组最后一个数为基准值
      const baseArr: number[] = arr[j]
      while (i < j) {
        //把所有比基准值小的数放在左边大的数放在右边
        while (i < j && this.calcRoadDistance(arr[i]) <= baseVal) {
          //找到一个比基准值大的数交换
          i++;
        }
        arr[j] = arr[i]; // 将较大的值放在右边如果没有比基准值大的数就是将自己赋值给自己（i 等于 j）
        while (j > i && this.calcRoadDistance(arr[j]) >= baseVal) {
          //找到一个比基准值小的数交换
          j--;
        }
        arr[i] = arr[j]; // 将较小的值放在左边如果没有找到比基准值小的数就是将自己赋值给自己（i 等于 j）
      }
      arr[j] = baseArr; // 将基准值放至中央位置完成一次循环（这时候 j 等于 i ）
      sort(arr, left, j - 1); // 将左边的无序数组重复上面的操作
      sort(arr, j + 1, right); // 将右边的无序数组重复上面的操作
    };
    // const newArr = array.concat(); // 为了保证这个函数是纯函数拷贝一次数组
    sort(array);
    return array;
  }
  /**
   * 根据路径点索引列表计算路径长度
   * @param temp 路径点索引列表
   */
  private calcRoadDistance(temp: number[]) {
    let totalDistance: number = 0
    for (let i: number = 0, len: number = temp.length; i < (len - 1); i++) {
      let pointStart: number[] = this.points[temp[i]],
        pointEnd: number[] = this.points[temp[i + 1]]
      // 累加两点间距离
      totalDistance += Math.round(Math.sqrt((pointStart[0] - pointEnd[0]) ** 2 + (pointStart[1] - pointEnd[1]) ** 2));
    }
    return totalDistance
  }
  /**
   * 获取可通行的最短路径
   * @param paths 排序后的路径列表
   */
  private getAvailablePointPath(paths: number[][], fromBuild: iBuild) {
    let resultPointPath: number[][] = []
    for (let i: number = 0, len: number = paths.length; i < len; i++) {
      let path: number[] = paths[i],  // 取出一条路径
        count: number = 0, // 计数器
        tempPath: number[][] = [] // 临时存路径
      tempPath.push(this.points[path[0]]) // 路径首点直接保存，不需检测
      for (let i = 1, plen = path.length-1; i < plen; i++) {
        let index = path[i] // 取出路径点索引
        let point: number[] = this.points[index] // 取得路径点坐标
        tempPath.push(point) // 取得路径点
        // 首尾路径点不用验证，中间路径点出现非己方建筑则表示路径不通
        if(i!=0 && i!=plen){
          let buildListValue = Object.values(this.buildList)
          for (let j = 0, blen = buildListValue.length; j < blen; j++) { // 循环所有建筑
            let build = buildListValue[j] // 取得建筑对象
            /**
              一个非己方建筑在路径点上，计数器加1
            */
            if (build.x == point[0] && build.y == point[1] && build.faction != fromBuild.faction) {
              count++
              break
            }
          }
        }
        if (count > 0) {
          break
        }
      }
      tempPath.push(this.points[path[path.length-1]]) // 路径尾点直接保存，不需检测
      if (count > 0) {
        // 路径不通，删除本路径
        paths.splice(i,1)
        len = paths.length
        i--
      }else{
        resultPointPath = [...tempPath]
        break;
      }
    }
    return resultPointPath
  }
  soldierDead(soldier: iSoldier){
    // 长宽为20的范围内的点均归一到中心点,如(0,0)到(10,10)范围内的点均会归一到点(5,5),以便减少死亡士兵的渲染数量
    let dx = Math.floor(soldier.ex - soldier.ex % 10 + 5)
    let dy = Math.floor(soldier.ey - soldier.ey % 10 + 5)
    soldier.ex = dx
    soldier.ey = dy
    soldier.health = Math.floor(Math.random()*3+1)
    if(!this.deadSoldier[dx+","+dy]){
      this.deadSoldier[dx+","+dy] = soldier
    }
    delete this.actionSoldier[soldier.idx]
    delete this.users[soldier.faction].soldierList[soldier.idx]
  }
  /**
   * 取消所有选择
   */
  unSelect() {
    Object.values(this.actionBuild).forEach(build => {
      build.selected = false
      build.hover = false
    })
    this.actionBuild = {}
  }
}
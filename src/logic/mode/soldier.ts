import {
  Faction,
  SoldierType
} from "../enum"
import {iMain} from "../interface/imain"
import {iSoldier} from "../interface/isoldier"

export default class Soldier implements iSoldier {
  fx: number; // 士兵出发X坐标
  fy: number; // 士兵出发Y坐标
  animateId: number = 0; // 动画id
  alive: boolean = true; // 士兵存活
  vector: number = 0; // 方向索引,用于显示
  moveType: number = 0; // 0: X根据Y运动，1：y根据x运动
  currentSite: number = 1; // 当前目标路径点索引
  isPause: boolean = false; // 是否暂停
  ex: number = 0; // 士兵被击杀X坐标
  ey: number = 0; // 士兵被击杀Y坐标
  health: number = 3; // 血量
  constructor(
    public idx: string,
    public x: number,
    public y: number,
    public type: SoldierType,
    public isPlayer: boolean,
    public speed: number,
    public attack: number,
    public defence: number,
    public faction: Faction,
    public waypoint: number[][] ,
    public lgrt: iMain
  ) {
    this.fx = x;
    this.fy = y;
    // 获取方向索引
    this.getVector()
    this.move()
  }
  // 循环运动
  move(){
    // 到达终点 或死亡
    if(this.currentSite > this.waypoint.length -1 || !this.alive){
      this.stop()
      return
    }
    // 循环位移
    this.displacement();
    this.animateId = window.requestAnimationFrame(()=>{
      this.move()
    });
  }
  /**
   * 停止运动
   */
  stop(){
    window.cancelAnimationFrame(this.animateId)
  }
  /**
   * 位移方法
   */
  private displacement() {
    let prevX:number = this.x
    // 暂停时 不位移
    if(this.isPause) return

    let from = this.waypoint[this.currentSite - 1],
      target = this.waypoint[this.currentSite]

    // 到达当前目标点，去下一个点为目标点
    if (this.x >= target[0]-8 && this.x <= target[0]+8  &&
        this.y>=target[1]-8 && this.y<=target[1]+8) {
      this.currentSite++
      // 获取方向索引
      this.getVector()
    }

    // 1.计算斜率，默认为y=kx
    let k = (target[1] - from[1]) / (target[0] - from[0])
    let reversx = target[0] < from[0] ? -1 : 1
    let reversy = target[1] < from[1] ? -1 : 1
    if(k==Infinity || k == -Infinity){
      this.y += (this.speed * reversy)
    }else{
      let a = from[1]-k*from[0]
      // let revers = 1
      // 改变坐标
      if (this.moveType) {
        //y=kx
        this.x += (this.speed * reversx)
        this.y = k * this.x + a
      } else {
        this.y += (this.speed * reversy)
        if(k==0){
          this.x = prevX
        }else{
          this.x = (this.y-a) / k
        }
      }
    }
  }
  /**
   * 获取当前方向，保存在this.vector中,获取运动类型，保存在moveType中
   */
  private getVector() {
    if(this.currentSite == this.waypoint.length) return
    let start = this.waypoint[this.currentSite - 1],
      end = this.waypoint[this.currentSite]
    let angle = Math.abs(Math.atan((end[1] - start[1]) / (end[0] - start[0])) * 180 / Math.PI)
    if(end[0] - start[0] >= 0 && end[1] - start[1] <= 0){
      // 一象限
    }
    if(end[0] - start[0] < 0 && end[1] - start[1] < 0){
      // 二象限
      angle = 180 - angle
    }
    if(end[0] - start[0] <= 0 && end[1] - start[1] >= 0){
      // 三象限
      angle = 180 + angle
    }
    if(end[0] - start[0] > 0 && end[1] - start[1] > 0){
      // 四象限
      angle = 360 - angle
    }
    let idx = Math.floor((angle + 11.24) / 22.5)
    idx == 16 ? idx = 0 : ''
    this.vector = idx
    // 得出 0、1、2、3、4、5、6、7、8、9、10、11、12、13、14、15 十六个方向
    // 对应 3、3、2、2、2、2、1、1、1、1、0 、0 、0 、0 、3 、3
    // 其中单数表示x随y变化，双数表示y随x变化
    let t = Math.floor((13 - idx) / 4);
    if (t < 0) {
      t += 4
    }
    this.moveType = t % 2
  }
  /**
   * 士兵被防御塔攻击
   */
  beAttacked(){
    if(this.health==0){
      this.ex = this.x
      this.ey = this.y
      this.alive = false
      this.lgrt.soldierDead(this)
      return
    }
    this.health --
  }
}
import {
  Faction
} from "../enum"
import {iUser} from "../interface/iuser"
import {iAI} from "../interface/iai"
import {iBuildList} from "../interface/ibuild"
import {iSoldierList} from "../interface/isoldier"

export default class User implements iUser {
  maxPopulation: number = 0; // 最大人口数
  maxBuild: number = 0; // 最大建筑数
  sendTroopNum: number = 0; // 出兵数
  battleDamage: number = 0; // 战损人数
  internalFriction: number = 0; // 内耗人数
  population: number = 0;
  tax: number = 0;
  buildList: iBuildList = {};
  soldierList: iSoldierList = {};
  skills: Array < any > = [] ;
  nowSkill: Array < any > = [] ;
  isDeath: boolean = false;

  constructor(
    public idx: string,
    public show:boolean,
    public name: string,
    public faction: Faction,
    public isPlayer: boolean,
    public ai: iAI | null) {}
  /**
   * 统计本阵营人口总数
   */
  demographic() {
    let militiaNum = 0
    Object.values(this.buildList).forEach(build => {
      militiaNum += build.level*10
    })
    this.population = militiaNum

    // 统计最大人口
    let totalPopulation = 0
    Object.values(this.buildList).forEach(build => {
      totalPopulation += build.population
    })
    if(totalPopulation>this.maxPopulation){
      this.maxPopulation = totalPopulation
    }

    // 统计最大建筑数
    let buildLen = Object.keys(this.buildList).length
    if(buildLen > this.maxBuild){
      this.maxBuild = buildLen
    }
  }
  /**
   * 学习新技能
   * @param skill 技能对象或技能对象数组
   */
  addSkills(skill: any | Array < any > ) {
    let tempSkills = [...this.skills]
    if (typeof skill == 'string') {
      tempSkills.push(skill)
    }
    if (Array.isArray(skill)) {
      tempSkills.concat(skill)
    }
    this.skills = Array.from(new Set(tempSkills))
  }
  /**
   * 随机设置当前可用的技能，最多4个
   */
  setNowSkill() {
    let tempSkills = [...this.skills]
    if (tempSkills.length <= 4) {
      this.nowSkill = [...tempSkills]
    } else {
      let i = 4,
        temp = []
      while (i > 0) {
        let len = tempSkills.length,
          idx = Math.floor(Math.random() * len)
        temp.push(tempSkills.splice(idx, 1)[0])
        i--
      }
      this.nowSkill = [...temp]
    }
  }
}
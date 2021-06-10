// 阵营
enum Faction {
  Red = "red", // 玩家或AI
  Yellow = "yellow", // 玩家或AI
  Blue = "blue", // 玩家或AI
  Green = "green", // 玩家或AI
  Gray = "gray", // 混乱阵营
}
// 建筑类型
enum BuildType {
  Town = "Town", // 城镇
  Arsenal = "Arsenal", // 兵工厂
  Stable = "Stable", // 马厩
  Castle = "Castle", // 城堡
  Tower = "Tower", // 防御塔
}
// 士兵类型
enum SoldierType {
  Militia = "Militia", // 民兵
  Armor = "Armor", // 甲兵
  Cavalry = "Cavalry", // 骑兵
}
// 技能类型
enum SkillType {
  freeze, // 冰冻
  aerolite, // 陨石
  poison, // 下毒
  thunderbolt, // 雷电
  defection, // 策反
  cover, // 盖
  quicken, // 加速
  retard, // 减速
}

// ai行为类型
enum baseBehavior {
  upgrade, // 升级
  transfer, // 调兵
  invade, // 攻击
  casting, // 施法
}
// ai难度
enum difficulty {
  easy, // 简单
  normal, // 普通
  hard, // 困难
  hell, // 地狱
}

export {
  Faction,
  BuildType,
  SoldierType,
  SkillType
}
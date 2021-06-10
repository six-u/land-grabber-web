
export interface iOption {
  difficulty: number; // 难度：1、简单，2、普通，3、困难
  towerRadius: {
    [key: string]: number
  }
  towerTime: {
    [key: string]: number
  }
}
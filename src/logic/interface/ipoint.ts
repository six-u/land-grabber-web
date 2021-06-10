import {Faction} from "../enum"
import {iPosition, iIndex} from "./ibase"
import {iBuild} from "./ibuild"

export interface iPoint extends iPosition, iIndex {
  faction: Faction | null
  border: iPointList
  build: iBuild
  hasBuild: boolean
}

export interface iPointList {
  [idx: string] : iPoint
}
import {BuildType,Faction} from "/@/logic/enum.ts"

export default {
  name: "1",
  user: [
    {
      faction: Faction.Red,
      isPlayer: true,
      show: true,
    },
    {
      faction: Faction.Blue,
      isPlayer: false,
      show: true,
    },
    {
      faction: Faction.Yellow,
      isPlayer: false,
      show: false,
    },
    {
      faction: Faction.Green,
      isPlayer: false,
      show: false,
    },
    {
      faction: Faction.Gray,
      isPlayer: false,
      show: true,
    },
  ],
  builds: [
    {
      x: 400,
      y: 200,
      type: BuildType.Town,
      faction: Faction.Red,
      level: 3,
    },
    {
      x: 800,
      y: 250,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 300,
      y: 400,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 150,
      y: 450,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 3,
    },
    {
      x: 900,
      y: 500,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 1150,
      y: 600,
      type: BuildType.Town,
      faction: Faction.Blue,
      level: 3,
    }
  ],
  roads: [
    [400, 200, 650, 300],
    [650, 300, 800, 250],
    [650, 300, 600, 450],
    [600, 450, 300, 400],
    [300, 400, 150, 450],
    [600, 450, 900, 500],
    [900, 500, 1150, 600]
  ],
};
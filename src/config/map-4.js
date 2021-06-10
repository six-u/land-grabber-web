import { BuildType, Faction } from "/@/logic/enum.ts";

export default {
  name: "4",
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
      x: 100,
      y: 200,
      type: BuildType.Town,
      faction: Faction.Red,
      level: 3,
    },
    {
      x: 200,
      y: 400,
      type: BuildType.Stable,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 400,
      y: 100,
      type: BuildType.Town,
      faction: Faction.Red,
      level: 3,
    },
    {
      x: 600,
      y: 200,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 3,
    },
    {
      x: 1100,
      y: 150,
      type: BuildType.Tower,
      faction: Faction.Gray,
      level: 4,
    },
    {
      x: 1200,
      y: 350,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 700,
      y: 450,
      type: BuildType.Stable,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 1000,
      y: 500,
      type: BuildType.Town,
      faction: Faction.Blue,
      level: 2,
    },
    {
      x: 1100,
      y: 600,
      type: BuildType.Town,
      faction: Faction.Blue,
      level: 4,
    },
    {
      x: 900,
      y: 600,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 2,
    }
  ],
  roads: [
    [100, 200, 200, 200],
    [200, 200, 200, 400],
    [200, 200, 400, 200],
    [400, 200, 400, 100],
    [400, 200, 600, 200],
    [600, 200, 1100, 150],
    [1100, 150, 1150, 300],
    [1150, 300, 1200, 350],
    [1150, 300, 850, 450],
    [850, 450, 700, 450],
    [850, 450, 900, 600],
    [850, 450, 1000, 500],
    [1000, 500, 1100, 600],
  ],
};

import { BuildType, Faction } from "/@/logic/enum.ts";

export default {
  name: "8",
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
      x: 250,
      y: 100,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 150,
      y: 200,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 350,
      y: 180,
      type: BuildType.Castle,
      faction: Faction.Red,
      level: 2,
    },
    {
      x: 500,
      y: 320,
      type: BuildType.Tower,
      faction: Faction.Gray,
      level: 3,
    },
    {
      x: 180,
      y: 420,
      type: BuildType.Arsenal,
      faction: Faction.Gray,
      level: 3,
    },
    {
      x: 260,
      y: 550,
      type: BuildType.Stable,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 400,
      y: 620,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 580,
      y: 600,
      type: BuildType.Castle,
      faction: Faction.Gray,
      level: 3,
    },
    {
      x: 700,
      y: 500,
      type: BuildType.Castle,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 700,
      y: 200,
      type: BuildType.Castle,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 1000,
      y: 380,
      type: BuildType.Tower,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 1100,
      y: 100,
      type: BuildType.Arsenal,
      faction: Faction.Gray,
      level: 3,
    },
    {
      x: 1220,
      y: 350,
      type: BuildType.Stable,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 950,
      y: 450,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 1250,
      y: 550,
      type: BuildType.Town,
      faction: Faction.Blue,
      level: 3,
    },
    {
      x: 1080,
      y: 620,
      type: BuildType.Town,
      faction: Faction.Blue,
      level: 2,
    },
    {
      x: 950,
      y: 580,
      type: BuildType.Town,
      faction: Faction.Blue,
      level: 2,
    }
  ],
  roads: [
    [150, 200, 250, 100],
    [250, 100, 280, 280],
    [150, 200, 350, 180],
    [150, 200, 280, 280],
    [250, 100, 350, 180],
    [350, 180, 280, 280],
    [350, 180, 600, 220],
    [280, 280, 280, 400],
    [280, 400, 180, 420],
    [280, 400, 500, 320],
    [280, 400, 420, 550],
    [600, 220, 620, 350],
    [600, 220, 700, 200],
    [500, 320, 620, 350],
    [620, 350, 700, 500],
    [700, 500, 580, 600],
    [700, 500, 950, 450],
    [420, 550, 260, 550],
    [260, 550, 400, 620],
    [400, 620, 420, 550],
    [420, 550, 580, 600],
    [580, 600, 950, 580],
    [950, 580, 1080, 620],
    [950, 580, 1080, 480],
    [1080, 620, 1250, 550],
    [1250, 550, 1080, 480],
    [1080, 480, 950, 450],
    [1080, 480, 1150, 350],
    [1150, 350, 1220, 350],
    [1150, 350, 1100, 100],
    [1150, 350, 1050, 300],
    [1050, 300, 1000, 380],
    [1050, 300, 700, 200]
  ],
};
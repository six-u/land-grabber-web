import { BuildType, Faction } from "/@/logic/enum.ts";

export default {
  name: "9",
  user: [
    {
      faction: Faction.Red,
      isPlayer: true,
      show: true,
    },
    {
      faction: Faction.Blue,
      isPlayer: false,
      show: false,
    },
    {
      faction: Faction.Yellow,
      isPlayer: false,
      show: true,
    },
    {
      faction: Faction.Green,
      isPlayer: false,
      show: true,
    },
    {
      faction: Faction.Gray,
      isPlayer: false,
      show: true,
    },
  ],
  builds: [
    {
      x: 200,
      y: 400,
      type: BuildType.Stable,
      faction: Faction.Green,
      level: 2,
    },
    {
      x: 350,
      y: 470,
      type: BuildType.Tower,
      faction: Faction.Green,
      level: 1,
    },
    {
      x: 350,
      y: 600,
      type: BuildType.Town,
      faction: Faction.Green,
      level: 1,
    },
    {
      x: 450,
      y: 370,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 570,
      y: 460,
      type: BuildType.Castle,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 800,
      y: 450,
      type: BuildType.Castle,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 800,
      y: 550,
      type: BuildType.Tower,
      faction: Faction.Yellow,
      level: 1,
    },
    {
      x: 950,
      y: 620,
      type: BuildType.Town,
      faction: Faction.Yellow,
      level: 1,
    },
    {
      x: 1100,
      y: 560,
      type: BuildType.Town,
      faction: Faction.Yellow,
      level: 1,
    },
    {
      x: 980,
      y: 460,
      type: BuildType.Town,
      faction: Faction.Yellow,
      level: 1,
    },
    {
      x: 700,
      y: 350,
      type: BuildType.Castle,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 480,
      y: 300,
      type: BuildType.Town,
      faction: Faction.Red,
      level: 2,
    },
    {
      x: 420,
      y: 200,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 580,
      y: 230,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 700,
      y: 110,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 980,
      y: 100,
      type: BuildType.Arsenal,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 1100,
      y: 180,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 750,
      y: 280,
      type: BuildType.Stable,
      faction: Faction.Gray,
      level: 2,
    },
    {
      x: 850,
      y: 210,
      type: BuildType.Tower,
      faction: Faction.Gray,
      level: 2,
    }
  ],
  roads: [
    [580, 230, 420, 200],
    [580, 230, 480, 300],
    [580, 230, 700, 350],
    [580, 230, 750, 280],
    [750, 280, 850, 210],
    [580, 230, 980, 100],
    [580, 230, 700, 110],
    [420, 200, 480, 300],
    [480, 300, 700, 350],
    [700, 350, 750, 280],
    [700, 350, 920, 320],
    [920, 320, 750, 280],
    [920, 320, 980, 100],
    [920, 320, 1100, 180],
    [1100, 180, 980, 100],
    [980, 100, 700, 110],
    [700, 350, 570, 460],
    [700, 350, 800, 450],
    [800, 450, 570, 460],
    [570, 460, 350, 470],
    [570, 460, 350, 600],
    [350, 470, 450, 370],
    [350, 470, 200, 400],
    [350, 470, 350, 600],
    [350, 600, 200, 400],
    [200, 400, 450, 370],
    [800, 450, 800, 550],
    [800, 550, 950, 620],
    [950, 620, 1100, 560],
    [1100, 560, 980, 460],
    [980, 460, 800, 450],
    [920, 530, 800, 550],
    [920, 530, 980, 460],
    [920, 530, 1100, 560],
    [920, 530, 950, 620],
    [920, 530, 800, 450]
  ],
};

import { BuildType, Faction } from "/@/logic/enum.ts";

export default {
  name: "2",
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
      show: false,
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
      x: 400,
      y: 100,
      type: BuildType.Town,
      faction: Faction.Red,
      level: 3,
    },
    {
      x: 600,
      y: 120,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 300,
      y: 300,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 3,
    },
    {
      x: 700,
      y: 400,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 3,
    },
    {
      x: 600,
      y: 500,
      type: BuildType.Castle,
      faction: Faction.Gray,
      level: 3,
    },
    {
      x: 750,
      y: 700,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 5,
    },
    {
      x: 900,
      y: 450,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 1,
    },
    {
      x: 1150,
      y: 500,
      type: BuildType.Town,
      faction: Faction.Green,
      level: 3,
    },
    {
      x: 1000,
      y: 600,
      type: BuildType.Town,
      faction: Faction.Gray,
      level: 3,
    },
  ],
  roads: [
    [400, 100, 500, 150],
    [500, 150, 600, 120],
    [500, 150, 520, 200],
    [520, 200, 300, 300],
    [300, 300, 600, 500],
    [520, 200, 700, 400],
    [700, 400, 600, 500],
    [600, 500, 750, 600],
    [750, 600, 900, 550],
    [900, 550, 900, 450],
    [900, 550, 1150, 500],
    [900, 550, 1000, 600],
  ],
};

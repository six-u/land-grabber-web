class imgList {
  [key: string]: any
}

const buildImgList:imgList = {
  Arsenal_blue_1: "",
  Arsenal_blue_2: "",
  Arsenal_blue_3: "",
  Arsenal_blue_4: "",
  Arsenal_blue_5: "",
  Arsenal_gray_1: "",
  Arsenal_gray_2: "",
  Arsenal_gray_3: "",
  Arsenal_gray_4: "",
  Arsenal_gray_5: "",
  Arsenal_green_1: "",
  Arsenal_green_2: "",
  Arsenal_green_3: "",
  Arsenal_green_4: "",
  Arsenal_green_5: "",
  Arsenal_red_1: "",
  Arsenal_red_2: "",
  Arsenal_red_3: "",
  Arsenal_red_4: "",
  Arsenal_red_5: "",
  Arsenal_yellow_1: "",
  Arsenal_yellow_2: "",
  Arsenal_yellow_3: "",
  Arsenal_yellow_4: "",
  Arsenal_yellow_5: "",

  Castle_blue_1: "",
  Castle_blue_2: "",
  Castle_blue_3: "",
  Castle_blue_4: "",
  Castle_blue_5: "",
  Castle_gray_1: "",
  Castle_gray_2: "",
  Castle_gray_3: "",
  Castle_gray_4: "",
  Castle_gray_5: "",
  Castle_green_1: "",
  Castle_green_2: "",
  Castle_green_3: "",
  Castle_green_4: "",
  Castle_green_5: "",
  Castle_red_1: "",
  Castle_red_2: "",
  Castle_red_3: "",
  Castle_red_4: "",
  Castle_red_5: "",
  Castle_yellow_1: "",
  Castle_yellow_2: "",
  Castle_yellow_3: "",
  Castle_yellow_4: "",
  Castle_yellow_5: "",

  Stable_blue_1: "",
  Stable_blue_2: "",
  Stable_blue_3: "",
  Stable_blue_4: "",
  Stable_blue_5: "",
  Stable_gray_1: "",
  Stable_gray_2: "",
  Stable_gray_3: "",
  Stable_gray_4: "",
  Stable_gray_5: "",
  Stable_green_1: "",
  Stable_green_2: "",
  Stable_green_3: "",
  Stable_green_4: "",
  Stable_green_5: "",
  Stable_red_1: "",
  Stable_red_2: "",
  Stable_red_3: "",
  Stable_red_4: "",
  Stable_red_5: "",
  Stable_yellow_1: "",
  Stable_yellow_2: "",
  Stable_yellow_3: "",
  Stable_yellow_4: "",
  Stable_yellow_5: "",

  Tower_blue_1: "",
  Tower_blue_2: "",
  Tower_blue_3: "",
  Tower_blue_4: "",
  Tower_blue_5: "",
  Tower_gray_1: "",
  Tower_gray_2: "",
  Tower_gray_3: "",
  Tower_gray_4: "",
  Tower_gray_5: "",
  Tower_green_1: "",
  Tower_green_2: "",
  Tower_green_3: "",
  Tower_green_4: "",
  Tower_green_5: "",
  Tower_red_1: "",
  Tower_red_2: "",
  Tower_red_3: "",
  Tower_red_4: "",
  Tower_red_5: "",
  Tower_yellow_1: "",
  Tower_yellow_2: "",
  Tower_yellow_3: "",
  Tower_yellow_4: "",
  Tower_yellow_5: "",

  Town_blue_1: "",
  Town_blue_2: "",
  Town_blue_3: "",
  Town_blue_4: "",
  Town_blue_5: "",
  Town_gray_1: "",
  Town_gray_2: "",
  Town_gray_3: "",
  Town_gray_4: "",
  Town_gray_5: "",
  Town_green_1: "",
  Town_green_2: "",
  Town_green_3: "",
  Town_green_4: "",
  Town_green_5: "",
  Town_red_1: "",
  Town_red_2: "",
  Town_red_3: "",
  Town_red_4: "",
  Town_red_5: "",
  Town_yellow_1: "",
  Town_yellow_2: "",
  Town_yellow_3: "",
  Town_yellow_4: "",
  Town_yellow_5: ""
};

const solderImgList:imgList = {
  Armor_blue_flag: "",
  Armor_blue: "",
  Armor_green_flag: "",
  Armor_green: "",
  Armor_red_flag: "",
  Armor_red: "",
  Armor_yellow_flag: "",
  Armor_yellow: "",

  Cavalry_blue_flag: "",
  Cavalry_blue: "",
  Cavalry_green_flag: "",
  Cavalry_green: "",
  Cavalry_red_flag: "",
  Cavalry_red: "",
  Cavalry_yellow_flag: "",
  Cavalry_yellow: "",

  Militia_blue_flag: "",
  Militia_blue: "",
  Militia_green_flag: "",
  Militia_green: "",
  Militia_red_flag: "",
  Militia_red: "",
  Militia_yellow_flag: "",
  Militia_yellow: "",
};

const bloodImgList:imgList = {
  blood_01: "",
  blood_02: "",
  blood_03: ""
};

let uiImg: any = "";

(function () {
  Object.keys(buildImgList).forEach((key) => {
    let img = new Image();
    img.src = `./img/cities/${key}.png`;
    buildImgList[key] = img;
  });
  Object.keys(solderImgList).forEach((key) => {
    let img = new Image();
    img.src = `./img/animation/${key}.png`;
    solderImgList[key] = img;
  });
  Object.keys(bloodImgList).forEach((key) => {
    let img = new Image();
    img.src = `./img/${key}.png`;
    bloodImgList[key] = img;
  });
  uiImg = new Image()
  uiImg.src = `./img/gui01.png`;
})();

export default {
  buildImgList,
  solderImgList,
  bloodImgList,
  uiImg
};

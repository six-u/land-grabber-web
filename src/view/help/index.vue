<template>
  <div class="help">
    <div class="page" v-if="step==1">
      <p class="tips tip1"></p>
      <p>点击己方建筑，然后点击想要攻打的敌方建筑发动攻击。</p>
      <p class="tips tip2"></p>
      <p>点击己方建筑，然后双击想要增援的建筑，可以派遣增援部队。</p>
      <p class="next-btn" @click="step++">下一步</p>
    </div>
    <div class="page" v-if="step==2">
      <p class="tips tip3"></p>
      <p>点击建筑上方出现的红色箭头升级建筑。</p>
      <p class="tips tip4"></p>
      <p>点击右键来取消选择建筑或技能（暂未实现）。</p>
      <p class="next-btn" @click="step++">下一步</p>
    </div>
    <div class="page" v-if="step==3">
      <div class="fl">
        <p class="tips tip5"></p>
        <p>来自铁匠铺的士兵比普通士兵更强壮。</p>
      </div>
      <div class="fl">
        <p class="tips tip6"></p>
        <p>骑兵移动速度比其他士兵更快。派遣普通士兵到马厩，他们会转为骑兵。</p>
      </div>
      <div class="fl">
        <p class="tips tip7"></p>
        <p>城堡的防御比其他建筑的防御高，金币产出也更高（暂未实现）。</p>
      </div>
      <div class="fl">
      <p class="tips tip8"></p>
        <p>防御塔会攻击敌方士兵，但不会增加人口。</p>
        <p class="next-btn" @click="back">确定</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from 'vue-router';
export default {
  setup(){
    let step = ref(1)
    const router = useRouter();
    const back = ()=>{
      router.push("/")
    }
    return {
      step,
      back
    }
  }
}
</script>

<style lang="scss">
.help{
  width: 1366px;
  height: 700px;
  margin: auto;
  .page{
    position: relative;
    width: 600px;
    height: 620px;
    margin: auto;
    background:  url('/img/settle.png') no-repeat;
    background-size: 100%;
    background-origin:content-box;
    overflow: hidden;
    padding: 0 64px;
    p{
      text-align: center;
      font-size: 16px;
      color: #FFF;
      text-shadow: 0 0 5px #000;
      &:nth-child(5),&:nth-child(6),&:nth-child(7),&:nth-child(8){
        font-size: 14px;
      }
    }
    .tips{
      margin: 16px auto;
      background: url('/img/gui01.png') no-repeat;
    }
    .tip1{
      width: 280px;
      height: 80px;
      background-position: -384px -208px;
      margin-top: 188px;
    }
    .tip2{
      width: 280px;
      height: 80px;
      background-position: -512px -128px;
    }
    .tip3{
      width: 216px;
      height: 80px;
      background-position: -792px -128px;
      margin-top: 188px;
    }
    .tip4{
      width: 216px;
      height: 80px;
      background-position: -392px -288px;
    }
    .tip5{
      width: 184px;
      height: 72px;
      background-position: -600px -285px;
      margin-top: 188px;
      transform: scale(.8);
      margin-bottom: 0;
    }
    .tip6{
      width: 200px;
      height: 88px;
      background-position: -392px -376px;
      margin-top: 188px;
      transform: scale(.8);
      margin-bottom: 0;
    }
    .tip7{
      width: 224px;
      height: 96px;
      background-position: -792px -248px;
      transform: scale(.8);
      margin: 0 auto;
    }
    .tip8{
      width: 144px;
      height: 108px;
      background-position: -768px -336px;
      transform: scale(.8);
      margin: 0 auto;
    }
    .fl{
      box-sizing: border-box;
      float: left;
      width: 296px;
      &:nth-child(1),&:nth-child(3){
        padding-left: 56px;
        padding-right: 16px;
      }
      &:nth-child(2),&:nth-child(4){
        padding-left: 16px;
        padding-right: 56px;
      }
      p{
        font-size: 14px;
        padding: 0 4px;
      }
    }
    .next-btn{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 108px;
      width: 196px;
      height: 24px;
      line-height: 24px;
      margin: auto;
      letter-spacing: 2px;
      font-size: 1.1em;
      cursor: pointer;
    }
  }
}
</style>
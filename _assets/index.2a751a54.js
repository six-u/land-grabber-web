let p=document.createElement("style");p.innerHTML=".help{width:1366px;height:700px;margin:auto}.help .page{position:relative;width:600px;height:620px;margin:auto;background:url(./img/settle.png) 0 0/100% no-repeat content-box border-box;overflow:hidden;padding:0 64px}.help .page p{text-align:center;font-size:16px;color:#fff;text-shadow:0 0 5px #000}.help .page p:nth-child(5),.help .page p:nth-child(6),.help .page p:nth-child(7),.help .page p:nth-child(8){font-size:14px}.help .page .tips{margin:16px auto;background:url(./img/gui01.png) no-repeat}.help .page .tip1{width:280px;height:80px;background-position:-384px -208px;margin-top:188px}.help .page .tip2{width:280px;height:80px;background-position:-512px -128px}.help .page .tip3{width:216px;height:80px;background-position:-792px -128px;margin-top:188px}.help .page .tip4{width:216px;height:80px;background-position:-392px -288px}.help .page .tip5{width:184px;height:72px;background-position:-600px -285px;margin-top:188px;transform:scale(.8);margin-bottom:0}.help .page .tip6{width:200px;height:88px;background-position:-392px -376px;margin-top:188px;transform:scale(.8);margin-bottom:0}.help .page .tip7{width:224px;height:96px;background-position:-792px -248px;transform:scale(.8);margin:0 auto}.help .page .tip8{width:144px;height:108px;background-position:-768px -336px;transform:scale(.8);margin:0 auto}.help .page .fl{box-sizing:border-box;float:left;width:296px}.help .page .fl:nth-child(1),.help .page .fl:nth-child(3){padding-left:56px;padding-right:16px}.help .page .fl:nth-child(2),.help .page .fl:nth-child(4){padding-left:16px;padding-right:56px}.help .page .fl p{font-size:14px;padding:0 4px}.help .page .next-btn{position:absolute;left:0;right:0;bottom:108px;width:196px;height:24px;line-height:24px;margin:auto;letter-spacing:2px;font-size:1.1em;cursor:pointer}",document.head.appendChild(p);import{d as t,u as i,o as e,c as a,a as l,b as n,e as s}from"./index.53ac35b0.js";var h={setup(){let p=t(1);const e=i();return{step:p,back:()=>{e.push("/")}}}};const o={class:"help"},g={key:0,class:"page"},x=l("p",{class:"tips tip1"},null,-1),d=l("p",null,"点击己方建筑，然后点击想要攻打的敌方建筑发动攻击。",-1),r=l("p",{class:"tips tip2"},null,-1),c=l("p",null,"点击己方建筑，然后双击想要增援的建筑，可以派遣增援部队。",-1),u={key:1,class:"page"},f=l("p",{class:"tips tip3"},null,-1),b=l("p",null,"点击建筑上方出现的红色箭头升级建筑。",-1),m=l("p",{class:"tips tip4"},null,-1),k=l("p",null,"点击右键来取消选择建筑或技能（暂未实现）。",-1),v={key:2,class:"page"},w=s('<div class="fl"><p class="tips tip5"></p><p>来自铁匠铺的士兵比普通士兵更强壮。</p></div><div class="fl"><p class="tips tip6"></p><p>骑兵移动速度比其他士兵更快。派遣普通士兵到马厩，他们会转为骑兵。</p></div><div class="fl"><p class="tips tip7"></p><p>城堡的防御比其他建筑的防御高，金币产出也更高（暂未实现）。</p></div>',3),z={class:"fl"},y=l("p",{class:"tips tip8"},null,-1),C=l("p",null,"防御塔会攻击敌方士兵，但不会增加人口。",-1);h.render=function(p,t,i,s,h,j){return e(),a("div",o,[1==s.step?(e(),a("div",g,[x,d,r,c,l("p",{class:"next-btn",onClick:t[1]||(t[1]=p=>s.step++)},"下一步")])):n("",!0),2==s.step?(e(),a("div",u,[f,b,m,k,l("p",{class:"next-btn",onClick:t[2]||(t[2]=p=>s.step++)},"下一步")])):n("",!0),3==s.step?(e(),a("div",v,[w,l("div",z,[y,C,l("p",{class:"next-btn",onClick:t[3]||(t[3]=(...p)=>s.back&&s.back(...p))},"确定")])])):n("",!0)])};export default h;
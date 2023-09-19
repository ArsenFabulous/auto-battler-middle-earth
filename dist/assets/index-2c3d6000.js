(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const e of o)if(e.type==="childList")for(const t of e.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&s(t)}).observe(document,{childList:!0,subtree:!0});function a(o){const e={};return o.integrity&&(e.integrity=o.integrity),o.referrerPolicy&&(e.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?e.credentials="include":o.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function s(o){if(o.ep)return;o.ep=!0;const e=a(o);fetch(o.href,e)}})();const l=sessionStorage.getItem("battleLog"),u=document.getElementById("battle-log");l&&(u.innerHTML=l);function f(){sessionStorage.setItem("battleLog",u.innerHTML)}const d={human:{name:"Пехотинец",strength:5,speed:3,accuracy:3,armor:10},cavalry:{name:"Кавалерия",strength:10,speed:5,accuracy:4,armor:6},elf:{name:"Эльф",strength:3,speed:6,accuracy:5,armor:4},orcLight:{name:"Легкий орк",strength:7,speed:4,accuracy:2,armor:6},orcHeavy:{name:"Тяжелый орк",strength:8,speed:2,accuracy:1,armor:8},wizard:{name:"Колдун",strength:2,speed:4,accuracy:4,armor:1}};function $(){const n=["human","elf","wizard","cavalry"],r=Math.floor(Math.random()*n.length);return n[r]}function L(){const n=["orcLight","orcHeavy","wizard"],r=Math.floor(Math.random()*n.length);return n[r]}document.getElementById("start-button").addEventListener("click",function(){const n=parseInt(document.getElementById("faction1").value),r=parseInt(document.getElementById("faction2").value);if(isNaN(n)||isNaN(r)){alert("Пожалуйста, введите число воинов для каждой фракции.");return}const a=m(n,1),s=m(r,2);M(a,s)});function m(n,r){const a=[];if(r===1){for(let s=0;s<n;s++){const o=$();a.push({...d[o],side:"фракция 1"})}return a}else{for(let s=0;s<n;s++){const o=L();a.push({...d[o],side:"фракция 2"})}return console.log(a),a}}async function M(n,r){const a=document.getElementById("battle-log"),s=document.getElementById("winner");let o=1;for(;n.length>0&&r.length>0;){if(n.length===0){s.innerHTML=`Победители: Орки (${r.length} ${i(r.length,["воин","воина","воинов"])})`;break}if(r.length===0){s.innerHTML=`Победители: Люди и Эльфы (${n.length} ${i(n.length,["воин","воина","воинов"])})`;break}a.innerHTML+=`
    <hr>
    <div class="battle-round">Раунд ${o}</div>
    `;let e,t;Math.random()>.5?(e=n.shift(),t=r.shift()):(t=r.shift(),e=n.shift());const g=100-e.accuracy*20,p=100-t.accuracy*20;if(Math.random()*100>=g){const c=e.strength*(Math.random()+.5);t.armor-=c,e.name==="Эльф"&&Math.random()*100<10?a.innerHTML+=`${e.name} из войска 1 моментально убил юнита ${t.name} из войска 2<br>`:e.name==="Колдун"?(t.side="фракция 1",n.push(t),a.innerHTML+=`${e.name} из войска 1 переманил юнита ${t.name} из войска 2<br>`):e.name==="Кавалерия"&&Math.random()*100<10&&(t.name==="Легкий орк"||t.name==="Тяжелый орк")?a.innerHTML+=`${e.name} из войска 1 пропускает ход из-за орка противника 2<br>`:t.armor<=0?a.innerHTML+=`${e.name} из войска 1 убил юнита ${t.name} из войска 2<br>`:(a.innerHTML+=`${e.name} из войска 1 атаковал юнита ${t.name} из войска 2, у него осталось ${t.armor.toFixed(2)} ед здоровья<br>`,r.push(t)),await h(e,t,c,0,a)}else a.innerHTML+=`${e.name} из войска 1 промахнулся по юниту ${t.name} из войска 2<br>`,n.push(e);if(r.length===0){s.innerHTML=`Победители: Люди и Эльфы (${n.length} ${i(n.length,["воин","воина","воинов"])})`;break}if(Math.random()*100>=p){const c=t.strength*(Math.random()+.5);e.armor-=c,t.name==="Эльф"&&Math.random()*100<10?a.innerHTML+=`${t.name} из войска 2 моментально убил юнита ${e.name} из войска 1<br>`:t.name==="Колдун"?(e.side="фракция 2",r.push(e),a.innerHTML+=`${t.name} из войска 2 переманил юнита ${e.name} из войска 1<br>`):t.name==="Кавалерия"&&Math.random()*100<10&&(e.name==="Легкий орк"||e.name==="Тяжелый орк")?a.innerHTML+=`${e.name} из войска 2 пропускает ход из-за орка противника 2<br>`:e.armor<=0?a.innerHTML+=`${t.name} из войска 2 убил юнита ${e.name} из войска 1<br>`:(a.innerHTML+=`${t.name} из войска 2 атаковал юнита ${e.name} из войска 1, у него осталось ${e.armor.toFixed(2)} ед здоровья<br>`,n.push(e)),await h(t,e,c,0,a)}else a.innerHTML+=`${t.name} из войска 2 промахнулся по юниту ${e.name} из войска 1<br>`,r.push(t);if(console.log("Первая армия - "+n.length+" Раунд"+o),console.log("Вторая армия - "+r.length+" Раунд"+o),n.length===0){s.innerHTML=`Победители: Орки (${r.length} ${i(r.length,["воин","воина","воинов"])})`;break}f(),o++}}function b(n){switch(n){case"Колдун":return`
      <pre>
       _
      / \\ 
       0  Ж  -    ~%
      /Д\\_|  -- - ~%%
      /_\\ |    - ~%
      </pre>`;case"Пехотинец":return`
      <pre>
       _  
      |0| D     
     $[Ш]\\|
      T T '
      </pre>`;case"Эльф":return`
      <pre>
       \\O/ \\    
      \\/|\\__)   #-->
       ,^, /
       J L'
      </pre>`;case"Кавалерия":return`
      <pre>
          |    
          ⊥
        0/'      
       $|   №P
    ~^##/##//
      bb bb 
      </pre>`;case"Легкий орк":return`
      <pre>
       "@"     
      Я|||R   / 
     ./ | \\.//
       / \\  "
      |   |
      </pre>`;case"Тяжелый орк":return`
      <pre>
       _  
      "@"     
    _Я[|]R_   / 
  .// ||| \\.//
     // \\\\   "
     || ||
      </pre>`}}function h(n,r,a,s,o){return new Promise(e=>{setTimeout(()=>{o.innerHTML+=`
              <div class="damage-animation">
                  ${n.name} наносит ${a.toFixed(2)} урона ${r.name}
                  ${b(n.name)}
              </div>
              `,e()},1e3)})}function i(n,r){const a=[2,0,1,1,1,2];return r[n%100>4&&n%100<20?2:a[n%10<5?n%10:5]]}window.addEventListener("beforeunload",()=>{f()});

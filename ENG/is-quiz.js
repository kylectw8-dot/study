const Q = window.QUIZ;

const $ = id => document.getElementById(id);
let list=[], idx=0, score=0, wrong=[], lastSet="all", answered=false;

function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function speak(text){
  try{ if(!('speechSynthesis' in window)) return; speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text.replace(/_+/g,"blank")); u.lang="en-GB"; u.rate=.85; speechSynthesis.speak(u);}catch(e){}
}
function show(id){["start","quiz","end"].forEach(s=>$(s).classList.toggle("hidden",s!==id));window.scrollTo(0,0);}

function begin(qs){
  list=shuffle(qs).map(q=>{const order=shuffle(q.o.map((_,i)=>i));return {...q,order};});
  idx=0;score=0;wrong=[];show("quiz");render();
}
function render(){
  answered=false;
  const q=list[idx];
  $("count").textContent=`Question ${idx+1} of ${list.length}`;
  $("pts").textContent=`⭐ ${score}`;
  $("barFill").style.width=(idx/list.length*100)+"%";
  $("topic").textContent=q.t;
  $("qtext").textContent=q.q;
  $("qzh").textContent=q.zh||"";
  $("qzh").classList.toggle("hidden",!$("zhToggle").checked);
  $("fb").className="fb hidden";
  $("nextBtn").classList.add("hidden");
  const box=$("opts"); box.innerHTML="";
  const letters="ABCD";
  q.order.forEach((oi,k)=>{
    const b=document.createElement("button");
    b.type="button";b.className="opt";b.dataset.oi=oi;
    b.innerHTML=`<span class="l">${letters[k]}</span><span></span>`;
    b.lastChild.textContent=q.o[oi];
    b.addEventListener("click",()=>choose(b,oi));
    box.appendChild(b);
  });
  if($("autoRead").checked) speak(q.q+". "+q.order.map((oi,k)=>letters[k]+", "+q.o[oi]).join(". "));
  box.firstChild.focus({preventScroll:true});
}
function choose(btn,oi){
  if(answered) return; answered=true;
  const q=list[idx], ok=oi===q.a;
  document.querySelectorAll(".opt").forEach(b=>{
    b.disabled=true; const v=+b.dataset.oi;
    if(v===q.a) b.classList.add("right"); else if(b===btn) b.classList.add("wrong"); else b.classList.add("dim");
  });
  const fb=$("fb");
  if(ok){score++; fb.className="fb ok"; fb.innerHTML="<b>✅ Correct! Great job.</b>";}
  else{wrong.push(q); fb.className="fb no"; fb.innerHTML="<b>Not quite. That's OK!</b>The answer is: <strong></strong>";
    fb.querySelector("strong").textContent=q.o[q.a]+".";}
  const e=document.createElement("div"); e.textContent="💡 "+q.e; e.style.marginTop="6px"; fb.appendChild(e);
  $("pts").textContent=`⭐ ${score}`;
  const n=$("nextBtn"); n.textContent= idx===list.length-1?"See my score":"Next question"; n.classList.remove("hidden"); n.focus({preventScroll:true});
}
function next(){ if(idx<list.length-1){idx++;render();} else finish(); }
function finish(){
  $("barFill").style.width="100%";
  const pct=score/list.length;
  $("final").textContent=`${score} / ${list.length}`;
  $("stars").textContent= pct>=.9?"⭐⭐⭐":pct>=.6?"⭐⭐":"⭐";
  $("msg").textContent= pct>=.9?"Excellent! You are ready for the quiz.":pct>=.6?"Good work! Practise the ones below once more.":"Good try! Read the notes again, then try your wrong ones.";
  const rb=$("reviewBox"); rb.innerHTML="";
  if(wrong.length){
    const t=document.createElement("div"); t.className="tip"; t.innerHTML="<b>Things to remember:</b>";
    const ul=document.createElement("ul"); ul.className="result-list";
    wrong.forEach(q=>{const li=document.createElement("li"); li.textContent=`${q.t}: ${q.o[q.a]} — ${q.e}`; ul.appendChild(li);});
    t.appendChild(ul); rb.appendChild(t);
  }
  $("retryWrong").classList.toggle("hidden",!wrong.length);
  show("end");
}
document.querySelectorAll("[data-set]").forEach(b=>b.addEventListener("click",()=>{
  lastSet=b.dataset.set; begin(lastSet==="all"?Q:Q.filter(q=>q.u==+lastSet));
}));
$("nextBtn").addEventListener("click",next);
$("speakBtn").addEventListener("click",()=>{const q=list[idx];speak(q.q+". "+q.order.map((oi,k)=>"ABCD"[k]+", "+q.o[oi]).join(". "));});
$("zhToggle").addEventListener("change",()=>$("qzh").classList.toggle("hidden",!$("zhToggle").checked));
$("retryWrong").addEventListener("click",()=>begin(wrong.map(({order,...q})=>q)));
$("again").addEventListener("click",()=>begin(lastSet==="all"?Q:Q.filter(q=>q.u==+lastSet)));
$("home").addEventListener("click",()=>show("start"));
document.addEventListener("keydown",e=>{
  if($("quiz").classList.contains("hidden")) return;
  const k=e.key.toUpperCase(), opts=[...document.querySelectorAll(".opt")];
  if("ABCD".includes(k)&&k.length===1&&!answered){const b=opts["ABCD".indexOf(k)]; if(b) b.click();}
});

/* Simple password gate for the study site. To change the password, replace HASH with the SHA-256 of the new password. */
(function(){
  var HASH='fbb7b714c6bdd6bc5ed928761c08623beecd87db5af8716adcd1823add89c560', KEY='studyGate';
  try{ if(localStorage.getItem(KEY)===HASH) return; }catch(e){}
  var de=document.documentElement; de.style.visibility='hidden';
  function sha(t){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)).then(function(b){return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')})}
  function show(){
    var w=document.createElement('div');
    w.setAttribute('style','position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:#f4f6fb;font-family:system-ui,"Noto Sans TC",sans-serif;visibility:visible');
    w.innerHTML='<form style="background:#fff;padding:28px 24px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.12);width:min(320px,88vw);text-align:center">'+
      '<div style="font-size:40px">🔒</div><h2 style="margin:8px 0 4px;font-size:20px;color:#222">Study Site</h2>'+
      '<p style="margin:0 0 16px;color:#666;font-size:14px">請輸入密碼 Please enter the password</p>'+
      '<input type="password" autocomplete="current-password" style="width:100%;box-sizing:border-box;padding:12px;font-size:16px;border:2px solid #ccd;border-radius:10px" autofocus>'+
      '<p class="err" style="color:#c0392b;font-size:14px;min-height:18px;margin:8px 0 0"></p>'+
      '<button style="margin-top:8px;width:100%;padding:12px;font-size:16px;border:0;border-radius:10px;background:#3b5bdb;color:#fff;cursor:pointer">進入 Enter</button></form>';
    document.body.appendChild(w);
    var f=w.querySelector('form'), i=w.querySelector('input'), err=w.querySelector('.err'); i.focus();
    f.addEventListener('submit',function(e){e.preventDefault(); sha(i.value).then(function(h){
      if(h===HASH){ try{localStorage.setItem(KEY,HASH);}catch(x){} w.remove(); de.style.visibility=''; }
      else { err.textContent='密碼錯誤 Wrong password'; i.value=''; i.focus(); }
    });});
  }
  if(document.body) show(); else document.addEventListener('DOMContentLoaded',show);
})();

(() => {
  const loginView=document.getElementById('login-view');
  const editorView=document.getElementById('editor-view');
  const loginForm=document.getElementById('login-form');
  const editorForm=document.getElementById('editor-form');
  const loginMsg=document.getElementById('login-msg');
  const saveMsg=document.getElementById('save-msg');
  const logout=document.getElementById('logout');
  const saveTop=document.getElementById('save-top');

  const setMsg=(el,msg,type='')=>{el.textContent=msg;el.className='msg '+type};
  async function api(path,opts={}){const r=await fetch(path,{cache:'no-store',headers:{'content-type':'application/json',...(opts.headers||{})},...opts});let j={};try{j=await r.json()}catch{}if(!r.ok)throw new Error(j.error||'İşlem başarısız.');return j}
  function showEditor(){loginView.hidden=true;editorView.hidden=false;logout.hidden=false}
  function showLogin(){loginView.hidden=false;editorView.hidden=true;logout.hidden=true}
  function fill(c){for(const el of editorForm.elements){if(!el.name)continue;if(el.name==='games')el.value=(c.games||[]).join('\n');else if(el.type==='checkbox')el.checked=Boolean(c[el.name]);else el.value=c[el.name]??''}}
  function collect(){const c={};for(const el of editorForm.elements){if(!el.name)continue;if(el.name==='games')c.games=el.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);else if(el.type==='checkbox')c[el.name]=el.checked;else c[el.name]=el.value.trim()}return c}
  async function load(){const me=await api('/api/me');if(!me.authenticated){showLogin();return}showEditor();const data=await api('/api/site-data');fill(data.config||{})}
  loginForm.addEventListener('submit',async e=>{e.preventDefault();setMsg(loginMsg,'Giriş yapılıyor...');try{await api('/api/login',{method:'POST',body:JSON.stringify({password:document.getElementById('password').value})});setMsg(loginMsg,'');await load()}catch(err){setMsg(loginMsg,err.message,'error')}});
  editorForm.addEventListener('submit',async e=>{e.preventDefault();await save()});
  saveTop.addEventListener('click',async()=>save());
  async function save(){setMsg(saveMsg,'Kaydediliyor...');try{const out=await api('/api/site-data',{method:'POST',body:JSON.stringify({config:collect()})});fill(out.config||{});setMsg(saveMsg,'Kaydedildi. Site güncellendi.','ok')}catch(err){setMsg(saveMsg,err.message,'error')}}
  logout.addEventListener('click',async()=>{try{await api('/api/logout',{method:'POST',body:'{}'})}finally{showLogin()}});
  load().catch(err=>{showLogin();setMsg(loginMsg,err.message,'error')});
})();
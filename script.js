
(function(){
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme')||'light'; html.setAttribute('data-theme', savedTheme);
  const isConfig = location.pathname.endsWith('configuracion.html');
  if(isConfig) document.querySelectorAll('.theme-toggle').forEach(t=>{t.checked=(savedTheme==='dark');t.onchange=()=>{const th=t.checked?'dark':'light';html.setAttribute('data-theme',th);localStorage.setItem('theme',th);document.querySelectorAll('.theme-toggle').forEach(x=>x.checked=t.checked);};});

  const DEF_AV = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB4Mj0iMSIgeTE9IjAiIHkyPSIxIj48c3RvcCBzdG9wLWNvbG9yPSIjNjY3ZWVhIiBvZmZzZXQ9IjAiLz48c3RvcCBzdG9wLWNvbG9yPSIjNzY0YmEyIiBvZmZzZXQ9IjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0idXJsKCNnKSIvPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjIwNiIgcj0iOTAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC44NSkiLz48cGF0aCBkPSJNODAgNDMyYzAtOTcgOTUtMTQyIDE3Ni0xNDJzMTc2IDQ1IDE3NiAxNDIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC44NSkiLz48L3N2Zz4=";
  const LS_USERS='nbr_users', LS_AUTH='nbr_auth', LS_ANUN='nbr_anuncios', LS_GUIAS='nbr_guias', LS_MEDS='nbr_medicamentos';

  function toast(m,t='info'){const o=document.querySelector('.toast');if(o)o.remove();const d=document.createElement('div');d.className='toast '+t;d.innerHTML=`<span>${m}</span><span class="close">✕</span>`;document.body.appendChild(d);const c=()=>d.remove();d.querySelector('.close').onclick=c;setTimeout(c,4200);} window.showToast=toast;
  function auth(){try{return JSON.parse(localStorage.getItem(LS_AUTH)||'{}')}catch{return{}}} function setAuth(x){localStorage.setItem(LS_AUTH,JSON.stringify(x||{}))}

  (function seed(){
    const users=JSON.parse(localStorage.getItem(LS_USERS)||'[]');
    if(!users.find(x=>x.username==='admin')) users.push({username:'admin',password:'1234',name:'Administrador',email:'admin@nbrweb.local',phone:'',institucion:'NBR WEB',role:'admin',status:'aprobado',cat:'Pediatra',avatar:'',createdAt:new Date().toISOString()});
    else { const a=users.find(x=>x.username==='admin'); if(!('password' in a)) a.password='1234'; }
    localStorage.setItem(LS_USERS,JSON.stringify(users));
    if(!localStorage.getItem(LS_ANUN)) localStorage.setItem(LS_ANUN, JSON.stringify([{id:crypto.randomUUID(),titulo:'Bienvenidos a NBR WEB',fecha:new Date().toISOString().slice(0,10),texto:'Plataforma médica para profesionales de pediatría y neonatología.',img:''}]));
    if(!localStorage.getItem(LS_GUIAS)) localStorage.setItem(LS_GUIAS, JSON.stringify([{id:crypto.randomUUID(),titulo:'Guía RCP Neonatal 2024',fecha:new Date().toISOString().slice(0,10),texto:'Protocolo actualizado de reanimación cardiopulmonar neonatal.',url:''}]));
    if(!localStorage.getItem(LS_MEDS)) {
      localStorage.setItem(LS_MEDS, JSON.stringify([
        {id:crypto.randomUUID(),nombre:'Adrenalina',grupo:'Vasopresores',dilucion:'1 ampolla (1mg/1ml) en 9ml SF = 0.1mg/ml',comentarios:'Dosis: 0.01-0.03 mg/kg IV. RCP: 0.01-0.03 mg/kg cada 3-5 min'},
        {id:crypto.randomUUID(),nombre:'Amikacina',grupo:'Antibióticos',dilucion:'Diluir en SF o SG 5% para infusión',comentarios:'Neonatos: 15-20 mg/kg/día c/24h. Niños: 15-22.5 mg/kg/día dividido c/8-12h'},
        {id:crypto.randomUUID(),nombre:'Ampicilina',grupo:'Antibióticos',dilucion:'Reconstituir con agua estéril, diluir en SF o SG 5%',comentarios:'Neonatos <7 días: 50-100 mg/kg c/12h. >7 días: 50-100 mg/kg c/8h. Meningitis: dosis más altas'},
        {id:crypto.randomUUID(),nombre:'Cafeína',grupo:'Estimulantes SNC',dilucion:'Citrato de cafeína 20mg/ml (oral o IV)',comentarios:'Carga: 20mg/kg. Mantenimiento: 5-10mg/kg/día. Para apnea del prematuro'},
        {id:crypto.randomUUID(),nombre:'Cefotaxima',grupo:'Antibióticos',dilucion:'Reconstituir y diluir en SF o SG 5%',comentarios:'Neonatos: 50mg/kg c/8-12h. Niños: 50-100mg/kg/día dividido c/6-8h. Meningitis: hasta 200mg/kg/día'},
        {id:crypto.randomUUID(),nombre:'Dexametasona',grupo:'Corticoides',dilucion:'Puede diluirse en SF o SG 5%',comentarios:'Antiinflamatorio: 0.15-0.6 mg/kg/día. Edema cerebral: 0.5-1 mg/kg dosis inicial'},
        {id:crypto.randomUUID(),nombre:'Dobutamina',grupo:'Inotrópicos',dilucion:'1 ampolla (250mg/20ml) + SF hasta 50ml = 5mg/ml',comentarios:'Dosis: 2-20 mcg/kg/min en infusión continua. Ajustar según respuesta hemodinámica'},
        {id:crypto.randomUUID(),nombre:'Dopamina',grupo:'Vasopresores',dilucion:'1 ampolla (200mg/5ml) + SF hasta 50ml = 4mg/ml',comentarios:'Dosis baja (2-5 mcg/kg/min): renal. Media (5-10): inotrópico. Alta (>10): vasopresor'},
        {id:crypto.randomUUID(),nombre:'Fentanilo',grupo:'Analgésicos',dilucion:'Diluir en SF, concentración típica 10-50 mcg/ml',comentarios:'Analgesia: 1-2 mcg/kg IV. Sedación: 1-5 mcg/kg/h en infusión continua'},
        {id:crypto.randomUUID(),nombre:'Furosemida',grupo:'Diuréticos',dilucion:'Puede administrarse directo IV o diluido en SF',comentarios:'Neonatos: 1-2 mg/kg/dosis c/12-24h. Niños: 1-2 mg/kg/dosis c/6-12h'},
        {id:crypto.randomUUID(),nombre:'Gentamicina',grupo:'Antibióticos',dilucion:'Diluir en SF o SG 5% para infusión 30-60 min',comentarios:'Neonatos: 4-5 mg/kg/día c/24-48h según edad. Niños: 5-7.5 mg/kg/día c/8h'},
        {id:crypto.randomUUID(),nombre:'Hidrocortisona',grupo:'Corticoides',dilucion:'Reconstituir con agua estéril, puede diluirse en SF',comentarios:'Insuficiencia suprarrenal: 1-2 mg/kg c/6-8h. Shock: 50-100 mg/m²/día'},
        {id:crypto.randomUUID(),nombre:'Midazolam',grupo:'Sedantes',dilucion:'Puede diluirse en SF o SG 5%',comentarios:'Sedación: 0.05-0.15 mg/kg IV. Infusión continua: 1-6 mcg/kg/min'},
        {id:crypto.randomUUID(),nombre:'Morfina',grupo:'Analgésicos',dilucion:'Diluir en SF, concentración típica 0.1-1 mg/ml',comentarios:'Analgesia: 0.05-0.2 mg/kg c/2-4h IV. Infusión: 10-40 mcg/kg/h'},
        {id:crypto.randomUUID(),nombre:'Surfactante',grupo:'Pulmonares',dilucion:'Listo para usar intratraqueal',comentarios:'Dosis: 100-200 mg/kg intratraqueal. Puede repetirse según protocolo'},
        {id:crypto.randomUUID(),nombre:'Vancomicina',grupo:'Antibióticos',dilucion:'Reconstituir y diluir en SF o SG 5%, infusión ≥60 min',comentarios:'Neonatos: 10-15 mg/kg c/8-24h según edad. Niños: 10-15 mg/kg c/6-8h. Monitorear niveles'}
      ]));
    }
  })();

  const path=location.pathname; const isAuth=/(^|\/)index\.html$/.test(path)||path.endsWith('/'); const isReg=path.endsWith('register.html'); if(!(isAuth||isReg)){const a=auth();if(!a.username){location.replace('index.html');return;}}

  const layout=document.querySelector('.layout'), sidebar=document.querySelector('.sidebar'), btn=document.getElementById('btnToggleSidebar'); const collapsed=localStorage.getItem('sidebarCollapsed')==='1'; if(layout&&collapsed)layout.classList.add('collapsed'); if(sidebar&&collapsed)sidebar.classList.add('collapsed'); if(btn&&sidebar&&layout) btn.onclick=()=>{sidebar.classList.toggle('collapsed');layout.classList.toggle('collapsed');localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed')?'1':'0')};

  function fillTop(){const info=document.getElementById('mainUserInfo'), av=document.getElementById('avatarTop');const a=auth();if(info&&a.username){const users=JSON.parse(localStorage.getItem(LS_USERS)||'[]');const u=users.find(x=>x.username===a.username);if(u){info.textContent=`${u.name||u.username} — ${u.role}`; if(av){av.src=u.avatar||DEF_AV; av.alt=(u.name||u.username)[0]||'';}}} const adminLink=document.querySelector('a[href="admin.html"]'); if(adminLink){const users=JSON.parse(localStorage.getItem(LS_USERS)||'[]');const u=users.find(x=>x.username===(auth().username)); adminLink.style.display=(u&&u.role==='admin')?'':'none';}} fillTop();
  window.logout=()=>{setAuth({});location.replace('index.html')};

  const loginForm=document.getElementById('loginForm');
  if(loginForm){loginForm.addEventListener('submit',(e)=>{e.preventDefault();const username=document.getElementById('loginUser').value.trim();const pass=document.getElementById('loginPass').value;const users=JSON.parse(localStorage.getItem(LS_USERS)||'[]');const user=users.find(u=>u.username===username);if(!user) return alert('Usuario no existe'); if(user.status!=='aprobado') return alert('Tu registro no ha sido aprobado'); if((user.password||'')!==pass) return alert('Contraseña incorrecta'); setAuth({username}); const titulo=user.role==='admin'?'Administrador':(user.cat||'Usuario'); localStorage.setItem('nbr_pending_toast', JSON.stringify({msg:`¡Bienvenido(a), ${titulo} ${user.name||user.username}!`, type:'success'})); location.replace('main.html');});}

  const registerForm=document.getElementById('registerForm');
  if(registerForm){registerForm.addEventListener('submit',(e)=>{e.preventDefault();const username=document.getElementById('registerUser').value.trim();const email=document.getElementById('registerEmail').value.trim();const cat=document.getElementById('registerCat').value;const phone=document.getElementById('registerPhone').value.trim();const inst=document.getElementById('registerInst').value.trim();const pass=document.getElementById('registerPass').value;const pass2=document.getElementById('registerPassConfirm').value; if(pass!==pass2) return alert('Las contraseñas no coinciden'); const users=JSON.parse(localStorage.getItem(LS_USERS)||'[]'); if(users.find(u=>u.username===username)) return alert('Ese usuario ya existe'); users.push({username,name:username,password:pass,email,phone,institucion:inst,role:'user',status:'pendiente',cat,avatar:'',createdAt:new Date().toISOString()}); localStorage.setItem(LS_USERS, JSON.stringify(users)); localStorage.setItem('nbr_pending_toast', JSON.stringify({msg:'Registro enviado. Espera aprobación del administrador.', type:'info'})); location.replace('index.html');});}

  const raw=localStorage.getItem('nbr_pending_toast'); if(raw){try{const d=JSON.parse(raw);toast(d.msg,d.type||'info');}catch{} localStorage.removeItem('nbr_pending_toast');}

  const cfgForm=document.getElementById('cfgForm');
  if(cfgForm){const a=auth();const users=JSON.parse(localStorage.getItem(LS_USERS)||'[]');const u=users.find(x=>x.username===a.username);const $=id=>document.getElementById(id); if(u){$('cfgUser').value=u.username;$('cfgName').value=u.name||'';$('cfgCat').value=u.cat||'';$('cfgMail').value=u.email||'';$('cfgPhone').value=u.phone||'';$('cfgInst').value=u.institucion||'';const prev=$('avatarTopPreview');prev.src=u.avatar||DEF_AV; $('cfgAvatarFile').addEventListener('change',(e)=>{const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{const img=new Image(); img.onload=()=>{const s=Math.min(img.width,img.height),sx=Math.floor((img.width-s)/2),sy=Math.floor((img.height-s)/2); const c=document.createElement('canvas'); c.width=c.height=512; const ctx=c.getContext('2d'); ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high'; ctx.drawImage(img,sx,sy,s,s,0,0,512,512); const d=c.toDataURL('image/jpeg',.9); prev.src=d; u.avatar=d; localStorage.setItem(LS_USERS,JSON.stringify(users)); fillTop(); toast('Avatar actualizado.','success');}; img.src=r.result;}; r.readAsDataURL(f);}); $('cfgAvatarClear').addEventListener('click',()=>{u.avatar=''; prev.src=DEF_AV; localStorage.setItem(LS_USERS,JSON.stringify(users)); fillTop(); toast('Avatar eliminado.','info');}); cfgForm.addEventListener('submit',(e)=>{e.preventDefault(); u.name=$('cfgName').value.trim(); u.cat=$('cfgCat').value; u.email=$('cfgMail').value.trim(); u.phone=$('cfgPhone').value.trim(); u.institucion=$('cfgInst').value.trim(); localStorage.setItem(LS_USERS, JSON.stringify(users)); fillTop(); toast('Perfil actualizado.','success');}); }}

  const adminUsersTable=document.getElementById('adminUsersTable'); const modalUser=document.getElementById('modalUser'); const userForm=document.getElementById('userForm');
  function openModal(id, show){const el=document.getElementById(id); if(el) el.style.display=show?'flex':'none';}
  function renderUsers(){ const tb=adminUsersTable?.querySelector('tbody'); if(!tb) return; const list=JSON.parse(localStorage.getItem(LS_USERS)||'[]'); const me=auth().username; tb.innerHTML=list.map(u=>`<tr><td>${u.username}</td><td>${u.name||''}</td><td>${u.cat||''}</td><td>${u.email||''}</td><td>${u.phone||''}</td><td>${u.institucion||''}</td><td>${u.role}</td><td><span class='chip'>${u.status||'pendiente'}</span></td><td style='display:flex;gap:8px;flex-wrap:wrap'><button class='btn sm' data-edit-user='${u.username}'>Editar</button><button class='btn sm secondary' data-approve='${u.username}'>Aprobar</button><button class='btn sm secondary' data-reject='${u.username}'>Rechazar</button><button class='btn sm danger' data-del-user='${u.username}' ${u.username===me?'disabled':''}>Eliminar</button></td></tr>`).join(''); tb.querySelectorAll('[data-edit-user]').forEach(b=>b.addEventListener('click',()=>{const username=b.getAttribute('data-edit-user'); const users=JSON.parse(localStorage.getItem(LS_USERS)||'[]'); const u=users.find(x=>x.username===username); if(!u) return; document.getElementById('u_username').value=u.username; document.getElementById('u_name').value=u.name||''; document.getElementById('u_email').value=u.email||''; document.getElementById('u_phone').value=u.phone||''; document.getElementById('u_inst').value=u.institucion||''; document.getElementById('u_cat').value=u.cat||''; document.getElementById('u_role').value=u.role||'user'; document.getElementById('u_status').value=u.status||'pendiente'; openModal('modalUser',true);})); tb.querySelectorAll('[data-approve]').forEach(b=>b.addEventListener('click',()=>{const username=b.getAttribute('data-approve'); const users=JSON.parse(localStorage.getItem(LS_USERS)||'[]'); const u=users.find(x=>x.username===username); if(!u) return; u.status='aprobado'; localStorage.setItem(LS_USERS,JSON.stringify(users)); renderUsers(); toast(`Usuario ${username} aprobado.`,'success');})); tb.querySelectorAll('[data-reject]').forEach(b=>b.addEventListener('click',()=>{const username=b.getAttribute('data-reject'); const users=JSON.parse(localStorage.getItem(LS_USERS)||'[]'); const u=users.find(x=>x.username===username); if(!u) return; u.status='rechazado'; localStorage.setItem(LS_USERS,JSON.stringify(users)); renderUsers(); toast(`Usuario ${username} rechazado.`,'info');})); tb.querySelectorAll('[data-del-user]').forEach(b=>b.addEventListener('click',()=>{const username=b.getAttribute('data-del-user'); if(!confirm(`¿Eliminar usuario ${username}?`)) return; const users=JSON.parse(localStorage.getItem(LS_USERS)||'[]').filter(x=>x.username!==username); localStorage.setItem(LS_USERS,JSON.stringify(users)); renderUsers(); toast(`Usuario ${username} eliminado.`,'info');})); }
  if(adminUsersTable) renderUsers();
  if(userForm){ userForm.addEventListener('submit',(e)=>{e.preventDefault(); const users=JSON.parse(localStorage.getItem(LS_USERS)||'[]'); const u=users.find(x=>x.username===document.getElementById('u_username').value); if(!u) return; u.name=document.getElementById('u_name').value.trim(); u.email=document.getElementById('u_email').value.trim(); u.phone=document.getElementById('u_phone').value.trim(); u.institucion=document.getElementById('u_inst').value.trim(); u.cat=document.getElementById('u_cat').value; u.role=document.getElementById('u_role').value; u.status=document.getElementById('u_status').value; localStorage.setItem(LS_USERS, JSON.stringify(users)); openModal('modalUser', false); renderUsers(); fillTop(); toast('Usuario actualizado.','success'); }); document.querySelectorAll('[data-close-user]').forEach(x=>x.addEventListener('click',()=>openModal('modalUser',false))); }

  const adminAnTable=document.getElementById('adminAnunciosTable'); const modalAn=document.getElementById('modalAnuncio'); const anuncioForm=document.getElementById('anuncioForm'); const btnNuevoAn=document.getElementById('btnNuevoAnuncio');
  function renderAnunciosAdmin(){ if(!adminAnTable) return; const tb=adminAnTable.querySelector('tbody'); const list=JSON.parse(localStorage.getItem(LS_ANUN)||'[]'); tb.innerHTML=list.map(a=>`<tr><td>${a.img?`<img src='${a.img}' class='thumb' style='width:60px;height:60px;border-radius:8px;border:1px solid var(--border);object-fit:cover;'>`:''}</td><td>${a.titulo}</td><td>${a.fecha}</td><td>${a.texto}</td><td><button class='btn sm' data-edit-an='${a.id}'>Editar</button> <button class='btn sm danger' data-del-an='${a.id}'>Eliminar</button></td></tr>`).join(''); tb.querySelectorAll('[data-edit-an]').forEach(b=>b.addEventListener('click',()=>openAnuncio(b.getAttribute('data-edit-an')))); tb.querySelectorAll('[data-del-an]').forEach(b=>b.addEventListener('click',()=>{const id=b.getAttribute('data-del-an'); const list=JSON.parse(localStorage.getItem(LS_ANUN)||'[]').filter(x=>x.id!==id); localStorage.setItem(LS_ANUN,JSON.stringify(list)); renderAnunciosAdmin(); renderAnunciosMain(); toast('Anuncio eliminado.','info');})); }
  function openAnuncio(id){ const list=JSON.parse(localStorage.getItem(LS_ANUN)||'[]'); const a=list.find(x=>x.id===id)||{id:'',titulo:'',fecha:'',texto:'',img:''}; document.getElementById('anuncioId').value=a.id; document.getElementById('anuncioTitulo').value=a.titulo||''; document.getElementById('anuncioFecha').value=a.fecha||''; document.getElementById('anuncioTexto').value=a.texto||''; document.getElementById('anuncioPreview').src=a.img||''; modalAn.style.display='flex'; }
  if(btnNuevoAn) btnNuevoAn.addEventListener('click',()=>openAnuncio(''));
  if(anuncioForm){ document.getElementById('anuncioImg').addEventListener('change',(e)=>{const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{document.getElementById('anuncioPreview').src=r.result;}; r.readAsDataURL(f);}); document.getElementById('btnAnuncioQuitarImg').addEventListener('click',()=>{document.getElementById('anuncioPreview').src='';}); anuncioForm.addEventListener('submit',(e)=>{e.preventDefault(); const id=document.getElementById('anuncioId').value||crypto.randomUUID(); const obj={ id, titulo: document.getElementById('anuncioTitulo').value.trim(), fecha: document.getElementById('anuncioFecha').value||new Date().toISOString().slice(0,10), texto: document.getElementById('anuncioTexto').value.trim(), img: document.getElementById('anuncioPreview').src||'' }; let list=JSON.parse(localStorage.getItem(LS_ANUN)||'[]'); const i=list.findIndex(x=>x.id===id); if(i>=0) list[i]=obj; else list.push(obj); localStorage.setItem(LS_ANUN,JSON.stringify(list)); modalAn.style.display='none'; renderAnunciosAdmin(); renderAnunciosMain(); toast('Anuncio guardado.','success');}); document.querySelectorAll('[data-close-anuncio]').forEach(x=>x.addEventListener('click',()=>modalAn.style.display='none')); }
  if(adminAnTable) renderAnunciosAdmin();

  const adminGTable=document.getElementById('adminGuiasTable'); const modalG=document.getElementById('modalGuia'); const guiaForm=document.getElementById('guiaForm'); const btnNuevaG=document.getElementById('btnNuevaGuia');
  function renderGuiasAdmin(){ if(!adminGTable) return; const tb=adminGTable.querySelector('tbody'); const list=JSON.parse(localStorage.getItem(LS_GUIAS)||'[]'); tb.innerHTML=list.map(g=>`<tr><td>${g.titulo}</td><td>${g.fecha}</td><td>${g.texto}</td><td>${g.url?`<a href='${g.url}' target='_blank'>Abrir</a>`:''}</td><td><button class='btn sm' data-edit-g='${g.id}'>Editar</button> <button class='btn sm danger' data-del-g='${g.id}'>Eliminar</button></td></tr>`).join(''); tb.querySelectorAll('[data-edit-g]').forEach(b=>b.addEventListener('click',()=>openGuia(b.getAttribute('data-edit-g')))); tb.querySelectorAll('[data-del-g]').forEach(b=>b.addEventListener('click',()=>{const id=b.getAttribute('data-del-g'); const list=JSON.parse(localStorage.getItem(LS_GUIAS)||'[]').filter(x=>x.id!==id); localStorage.setItem(LS_GUIAS,JSON.stringify(list)); renderGuiasAdmin(); renderGuiasMain(); toast('Guía eliminada.','info');})); }
  function openGuia(id){ const list=JSON.parse(localStorage.getItem(LS_GUIAS)||'[]'); const g=list.find(x=>x.id===id)||{id:'',titulo:'',fecha:'',texto:'',url:''}; document.getElementById('guiaId').value=g.id; document.getElementById('guiaTitulo').value=g.titulo||''; document.getElementById('guiaFecha').value=g.fecha||''; document.getElementById('guiaTexto').value=g.texto||''; document.getElementById('guiaURL').value=g.url||''; modalG.style.display='flex'; }
  if(btnNuevaG) btnNuevaG.addEventListener('click',()=>openGuia(''));
  if(guiaForm){ guiaForm.addEventListener('submit',(e)=>{e.preventDefault(); const id=document.getElementById('guiaId').value||crypto.randomUUID(); const g={ id, titulo: document.getElementById('guiaTitulo').value.trim(), fecha: document.getElementById('guiaFecha').value||new Date().toISOString().slice(0,10), texto: document.getElementById('guiaTexto').value.trim(), url: document.getElementById('guiaURL').value.trim() }; let list=JSON.parse(localStorage.getItem(LS_GUIAS)||'[]'); const i=list.findIndex(x=>x.id===id); if(i>=0) list[i]=g; else list.push(g); localStorage.setItem(LS_GUIAS,JSON.stringify(list)); modalG.style.display='none'; renderGuiasAdmin(); renderGuiasMain(); toast('Guía guardada.','success');}); document.querySelectorAll('[data-close-guia]').forEach(x=>x.addEventListener('click',()=>modalG.style.display='none')); }
  if(adminGTable) renderGuiasAdmin();

  function renderAnunciosMain(){ const cont=document.getElementById('anunciosList'); if(!cont) return; const list=JSON.parse(localStorage.getItem(LS_ANUN)||'[]').sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||'')); cont.innerHTML=list.map(a=>`<article class='glass' style='padding:10px;border-radius:12px;display:flex;gap:10px;align-items:flex-start'>${a.img?`<img src='${a.img}' alt='' style='width:72px;height:72px;border-radius:10px;border:1px solid var(--border);object-fit:cover;'>`:''}<div><div style='display:flex;gap:8px;align-items:center'><strong>${a.titulo}</strong><span class='chip'>${a.fecha}</span></div><div class='text-muted'>${a.texto}</div></div></article>`).join(''); }
  function renderGuiasMain(){ const cont=document.getElementById('guiasList'); if(!cont) return; const list=JSON.parse(localStorage.getItem(LS_GUIAS)||'[]').sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||'')); cont.innerHTML=list.map(g=>`<div class='glass' style='padding:10px;border-radius:12px'><div style='display:flex;gap:8px;align-items:center'><strong>${g.titulo}</strong><span class='chip'>${g.fecha}</span></div><div class='text-muted'>${g.texto}</div>${g.url?`<div class='mt12'><a class='btn sm' target='_blank' href='${g.url}'>Abrir</a></div>`:''}</div>`).join(''); }
  renderAnunciosMain(); renderGuiasMain();

  const drugTable = document.getElementById('drugTable');
  const drugSearch = document.getElementById('drugSearch');
  
  function renderDrugs(filter='') {
    if(!drugTable) return;
    const tbody = drugTable.querySelector('tbody');
    const list = JSON.parse(localStorage.getItem(LS_MEDS)||'[]');
    const filtered = filter ? list.filter(d => 
      d.nombre.toLowerCase().includes(filter.toLowerCase()) ||
      d.grupo.toLowerCase().includes(filter.toLowerCase()) ||
      d.comentarios.toLowerCase().includes(filter.toLowerCase())
    ) : list;
    
    tbody.innerHTML = filtered.sort((a,b)=>a.nombre.localeCompare(b.nombre)).map(d => 
      `<tr><td><strong>${d.nombre}</strong></td><td>${d.grupo}</td><td>${d.dilucion}</td><td class='text-muted'>${d.comentarios}</td></tr>`
    ).join('');
  }
  
  if(drugSearch) {
    drugSearch.addEventListener('input', (e) => renderDrugs(e.target.value));
  }
  renderDrugs();

  const adminMedsTable = document.getElementById('adminMedicamentosTable');
  const modalMed = document.getElementById('modalMedicamento');
  const medForm = document.getElementById('medicamentoForm');
  const btnNuevoMed = document.getElementById('btnNuevoMedicamento');
  
  function renderMedsAdmin() {
    if(!adminMedsTable) return;
    const tbody = adminMedsTable.querySelector('tbody');
    const list = JSON.parse(localStorage.getItem(LS_MEDS)||'[]');
    tbody.innerHTML = list.sort((a,b)=>a.nombre.localeCompare(b.nombre)).map(m => 
      `<tr><td>${m.nombre}</td><td>${m.grupo}</td><td>${m.dilucion}</td><td>${m.comentarios}</td><td><button class='btn sm' data-edit-med='${m.id}'>Editar</button> <button class='btn sm danger' data-del-med='${m.id}'>Eliminar</button></td></tr>`
    ).join('');
    
    tbody.querySelectorAll('[data-edit-med]').forEach(b => b.addEventListener('click', () => openMedicamento(b.getAttribute('data-edit-med'))));
    tbody.querySelectorAll('[data-del-med]').forEach(b => b.addEventListener('click', () => {
      const id = b.getAttribute('data-del-med');
      if(!confirm('¿Eliminar este medicamento?')) return;
      const list = JSON.parse(localStorage.getItem(LS_MEDS)||'[]').filter(x => x.id !== id);
      localStorage.setItem(LS_MEDS, JSON.stringify(list));
      renderMedsAdmin();
      renderDrugs();
      toast('Medicamento eliminado.', 'info');
    }));
  }
  
  function openMedicamento(id) {
    const list = JSON.parse(localStorage.getItem(LS_MEDS)||'[]');
    const m = list.find(x => x.id === id) || {id:'', nombre:'', grupo:'', dilucion:'', comentarios:''};
    document.getElementById('medId').value = m.id;
    document.getElementById('medNombre').value = m.nombre || '';
    document.getElementById('medGrupo').value = m.grupo || '';
    document.getElementById('medDilucion').value = m.dilucion || '';
    document.getElementById('medComentarios').value = m.comentarios || '';
    modalMed.style.display = 'flex';
  }
  
  if(btnNuevoMed) btnNuevoMed.addEventListener('click', () => openMedicamento(''));
  
  if(medForm) {
    medForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('medId').value || crypto.randomUUID();
      const obj = {
        id,
        nombre: document.getElementById('medNombre').value.trim(),
        grupo: document.getElementById('medGrupo').value.trim(),
        dilucion: document.getElementById('medDilucion').value.trim(),
        comentarios: document.getElementById('medComentarios').value.trim()
      };
      let list = JSON.parse(localStorage.getItem(LS_MEDS)||'[]');
      const idx = list.findIndex(x => x.id === id);
      if(idx >= 0) list[idx] = obj;
      else list.push(obj);
      localStorage.setItem(LS_MEDS, JSON.stringify(list));
      modalMed.style.display = 'none';
      renderMedsAdmin();
      renderDrugs();
      toast('Medicamento guardado.', 'success');
    });
    
    document.querySelectorAll('[data-close-med]').forEach(x => x.addEventListener('click', () => modalMed.style.display = 'none'));
  }
  
  if(adminMedsTable) renderMedsAdmin();
})();

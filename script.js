
(async function(){
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme')||'light'; 
  html.setAttribute('data-theme', savedTheme);
  
  const isConfig = location.pathname.endsWith('configuracion.html');
  if(isConfig) {
    document.querySelectorAll('.theme-toggle').forEach(t=>{
      t.checked=(savedTheme==='dark');
      t.onchange=()=>{
        const th=t.checked?'dark':'light';
        html.setAttribute('data-theme',th);
        localStorage.setItem('theme',th);
        document.querySelectorAll('.theme-toggle').forEach(x=>x.checked=t.checked);
      };
    });
  }

  const DEF_AV = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB4Mj0iMSIgeTE9IjAiIHkyPSIxIj48c3RvcCBzdG9wLWNvbG9yPSIjNjY3ZWVhIiBvZmZzZXQ9IjAiLz48c3RvcCBzdG9wLWNvbG9yPSIjNzY0YmEyIiBvZmZzZXQ9IjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0idXJsKCNnKSIvPjxjaXJjbGUgY3g9IjI1NiIgY3k9IjIwNiIgcj0iOTAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC44NSkiLz48cGF0aCBkPSJNODAgNDMyYzAtOTcgOTUtMTQyIDE3Ni0xNDJzMTc2IDQ1IDE3NiAxNDIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC44NSkiLz48L3N2Zz4=";

  function toast(m,t='info'){
    const o=document.querySelector('.toast');
    if(o)o.remove();
    const d=document.createElement('div');
    d.className='toast '+t;
    d.innerHTML=`<span>${m}</span><span class="close">✕</span>`;
    document.body.appendChild(d);
    const c=()=>d.remove();
    d.querySelector('.close').onclick=c;
    setTimeout(c,4200);
  } 
  window.showToast=toast;

  async function api(endpoint, options = {}) {
    try {
      const res = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error en la solicitud');
      }
      return data;
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  }

  let currentSession = null;
  
  async function checkSession() {
    try {
      const data = await api('/session');
      if (data.authenticated) {
        currentSession = data.user;
        return data.user;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  const path=location.pathname;
  const isAuth=/(^|\/)index\.html$/.test(path)||path.endsWith('/');
  const isReg=path.endsWith('register.html');
  const isReset=path.endsWith('reset-password.html');
  
  if(!(isAuth||isReg||isReset)){
    const session = await checkSession();
    if(!session){
      location.replace('index.html');
      return;
    }
  }

  const layout=document.querySelector('.layout');
  const sidebar=document.querySelector('.sidebar');
  const btn=document.getElementById('btnToggleSidebar');
  const collapsed=localStorage.getItem('sidebarCollapsed')==='1';
  
  if(layout&&collapsed)layout.classList.add('collapsed');
  if(sidebar&&collapsed)sidebar.classList.add('collapsed');
  
  if(btn&&sidebar&&layout) {
    btn.onclick=()=>{
      sidebar.classList.toggle('collapsed');
      layout.classList.toggle('collapsed');
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed')?'1':'0');
    };
  }

  async function fillTop(){
    const info=document.getElementById('mainUserInfo');
    const av=document.getElementById('avatarTop');
    const session = await checkSession();
    
    if(info&&session){
      try {
        const profile = await api('/profile');
        info.textContent=`${profile.name||profile.username} — ${profile.role}`;
        if(av){
          av.src=profile.avatar||DEF_AV;
          av.alt=(profile.name||profile.username)[0]||'';
        }
        
        const adminLink=document.querySelector('a[href="admin.html"]');
        if(adminLink){
          adminLink.style.display=(profile.role==='admin')?'':'none';
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    }
  }
  
  if(!isAuth && !isReg && !isReset) {
    await fillTop();
  }

  window.logout=async ()=>{
    try {
      await api('/logout', {method: 'POST'});
      currentSession = null;
      location.replace('index.html');
    } catch (err) {
      console.error('Logout error:', err);
      location.replace('index.html');
    }
  };

  const loginForm=document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit',async (e)=>{
      e.preventDefault();
      const username=document.getElementById('loginUser').value.trim();
      const pass=document.getElementById('loginPass').value;
      
      try {
        const data = await api('/login', {
          method: 'POST',
          body: JSON.stringify({username, password: pass})
        });
        
        if(data.success) {
          const titulo=data.user.role==='admin'?'Administrador':(data.user.cat||'Usuario');
          localStorage.setItem('nbr_pending_toast', JSON.stringify({
            msg:`¡Bienvenido(a), ${titulo} ${data.user.name||data.user.username}!`,
            type:'success'
          }));
          location.replace('main.html');
        }
      } catch (err) {
        alert(err.message);
      }
    });
  }

  const registerForm=document.getElementById('registerForm');
  if(registerForm){
    registerForm.addEventListener('submit',async (e)=>{
      e.preventDefault();
      const username=document.getElementById('registerUser').value.trim();
      const email=document.getElementById('registerEmail').value.trim();
      const cat=document.getElementById('registerCat').value;
      const phone=document.getElementById('registerPhone').value.trim();
      const institucion=document.getElementById('registerInst').value.trim();
      const password=document.getElementById('registerPass').value;
      const password2=document.getElementById('registerPassConfirm').value;
      
      if(password!==password2) return alert('Las contraseñas no coinciden');
      
      try {
        const data = await api('/register', {
          method: 'POST',
          body: JSON.stringify({username, email, cat, phone, institucion, password})
        });
        
        localStorage.setItem('nbr_pending_toast', JSON.stringify({
          msg: data.message,
          type:'info'
        }));
        location.replace('index.html');
      } catch (err) {
        alert(err.message);
      }
    });
  }

  const resetRequestForm = document.getElementById('resetRequestForm');
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  const requestBox = document.getElementById('requestBox');
  const resetBox = document.getElementById('resetBox');
  const tokenDisplay = document.getElementById('tokenDisplay');
  
  if(resetRequestForm) {
    resetRequestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('resetUser').value.trim();
      const email = document.getElementById('resetEmail').value.trim();
      
      try {
        const data = await api('/reset-password-request', {
          method: 'POST',
          body: JSON.stringify({username, email})
        });
        
        if(data.success) {
          tokenDisplay.innerHTML = `<strong>Código de recuperación:</strong><br><code style="font-size:14px;user-select:all;">${data.token}</code><br><small style="color:var(--text-muted);margin-top:8px;display:block;">Guarda este código. Lo necesitarás para restablecer tu contraseña.</small>`;
          tokenDisplay.style.display = 'block';
          requestBox.style.display = 'none';
          resetBox.style.display = 'block';
          document.getElementById('resetToken').value = data.token;
          toast(data.message, 'success');
        }
      } catch (err) {
        alert(err.message);
      }
    });
  }
  
  if(resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = document.getElementById('resetToken').value.trim();
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if(newPassword !== confirmPassword) {
        return alert('Las contraseñas no coinciden');
      }
      
      try {
        const data = await api('/reset-password', {
          method: 'POST',
          body: JSON.stringify({token, newPassword})
        });
        
        if(data.success) {
          localStorage.setItem('nbr_pending_toast', JSON.stringify({
            msg: data.message,
            type:'success'
          }));
          location.replace('index.html');
        }
      } catch (err) {
        alert(err.message);
      }
    });
  }

  const raw=localStorage.getItem('nbr_pending_toast');
  if(raw){
    try{
      const d=JSON.parse(raw);
      toast(d.msg,d.type||'info');
    }catch{}
    localStorage.removeItem('nbr_pending_toast');
  }

  const cfgForm=document.getElementById('cfgForm');
  if(cfgForm){
    try {
      const profile = await api('/profile');
      const $=id=>document.getElementById(id);
      
      $('cfgUser').value=profile.username;
      $('cfgName').value=profile.name||'';
      $('cfgCat').value=profile.cat||'';
      $('cfgMail').value=profile.email||'';
      $('cfgPhone').value=profile.phone||'';
      $('cfgInst').value=profile.institucion||'';
      
      const prev=$('avatarTopPreview');
      prev.src=profile.avatar||DEF_AV;
      
      $('cfgAvatarFile').addEventListener('change',(e)=>{
        const f=e.target.files[0];
        if(!f)return;
        const r=new FileReader();
        r.onload=()=>{
          const img=new Image();
          img.onload=async()=>{
            const s=Math.min(img.width,img.height);
            const sx=Math.floor((img.width-s)/2);
            const sy=Math.floor((img.height-s)/2);
            const c=document.createElement('canvas');
            c.width=c.height=512;
            const ctx=c.getContext('2d');
            ctx.imageSmoothingEnabled=true;
            ctx.imageSmoothingQuality='high';
            ctx.drawImage(img,sx,sy,s,s,0,0,512,512);
            const d=c.toDataURL('image/jpeg',.9);
            prev.src=d;
            
            try {
              await api('/profile', {
                method: 'PUT',
                body: JSON.stringify({avatar: d})
              });
              await fillTop();
              toast('Avatar actualizado.','success');
            } catch (err) {
              toast('Error al actualizar avatar.','error');
            }
          };
          img.src=r.result;
        };
        r.readAsDataURL(f);
      });
      
      $('cfgAvatarClear').addEventListener('click',async()=>{
        try {
          await api('/profile', {
            method: 'PUT',
            body: JSON.stringify({avatar: ''})
          });
          prev.src=DEF_AV;
          await fillTop();
          toast('Avatar eliminado.','info');
        } catch (err) {
          toast('Error al eliminar avatar.','error');
        }
      });
      
      cfgForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        try {
          await api('/profile', {
            method: 'PUT',
            body: JSON.stringify({
              name: $('cfgName').value.trim(),
              cat: $('cfgCat').value,
              email: $('cfgMail').value.trim(),
              phone: $('cfgPhone').value.trim(),
              institucion: $('cfgInst').value.trim()
            })
          });
          await fillTop();
          toast('Perfil actualizado.','success');
        } catch (err) {
          toast('Error al actualizar perfil.','error');
        }
      });
    } catch (err) {
      console.error('Error loading config:', err);
    }
  }

  const adminUsersTable=document.getElementById('adminUsersTable');
  const modalUser=document.getElementById('modalUser');
  const userForm=document.getElementById('userForm');
  
  function openModal(id, show){
    const el=document.getElementById(id);
    if(el) el.style.display=show?'flex':'none';
  }
  
  async function renderUsers(){
    const tb=adminUsersTable?.querySelector('tbody');
    if(!tb) return;
    
    try {
      const session = await checkSession();
      const users = await api('/users');
      const me=session.username;
      
      tb.innerHTML=users.map(u=>`<tr><td>${u.username}</td><td>${u.name||''}</td><td>${u.cat||''}</td><td>${u.email||''}</td><td>${u.phone||''}</td><td>${u.institucion||''}</td><td>${u.role}</td><td><span class='chip'>${u.status||'pendiente'}</span></td><td style='display:flex;gap:8px;flex-wrap:wrap'><button class='btn sm' data-edit-user='${u.username}'>Editar</button><button class='btn sm secondary' data-approve='${u.username}'>Aprobar</button><button class='btn sm secondary' data-reject='${u.username}'>Rechazar</button><button class='btn sm danger' data-del-user='${u.username}' ${u.username===me?'disabled':''}>Eliminar</button></td></tr>`).join('');
      
      tb.querySelectorAll('[data-edit-user]').forEach(b=>b.addEventListener('click',async()=>{
        const username=b.getAttribute('data-edit-user');
        const users = await api('/users');
        const u=users.find(x=>x.username===username);
        if(!u) return;
        
        document.getElementById('u_username').value=u.username;
        document.getElementById('u_name').value=u.name||'';
        document.getElementById('u_email').value=u.email||'';
        document.getElementById('u_phone').value=u.phone||'';
        document.getElementById('u_inst').value=u.institucion||'';
        document.getElementById('u_cat').value=u.cat||'';
        document.getElementById('u_role').value=u.role||'user';
        document.getElementById('u_status').value=u.status||'pendiente';
        openModal('modalUser',true);
      }));
      
      tb.querySelectorAll('[data-approve]').forEach(b=>b.addEventListener('click',async()=>{
        const username=b.getAttribute('data-approve');
        try {
          await api(`/users/${username}`, {
            method: 'PUT',
            body: JSON.stringify({status: 'aprobado'})
          });
          await renderUsers();
          toast(`Usuario ${username} aprobado.`,'success');
        } catch (err) {
          toast('Error al aprobar usuario.','error');
        }
      }));
      
      tb.querySelectorAll('[data-reject]').forEach(b=>b.addEventListener('click',async()=>{
        const username=b.getAttribute('data-reject');
        try {
          await api(`/users/${username}`, {
            method: 'PUT',
            body: JSON.stringify({status: 'rechazado'})
          });
          await renderUsers();
          toast(`Usuario ${username} rechazado.`,'info');
        } catch (err) {
          toast('Error al rechazar usuario.','error');
        }
      }));
      
      tb.querySelectorAll('[data-del-user]').forEach(b=>b.addEventListener('click',async()=>{
        const username=b.getAttribute('data-del-user');
        if(!confirm(`¿Eliminar usuario ${username}?`))return;
        try {
          await api(`/users/${username}`, {method: 'DELETE'});
          await renderUsers();
          toast(`Usuario ${username} eliminado.`,'info');
        } catch (err) {
          toast('Error al eliminar usuario.','error');
        }
      }));
    } catch (err) {
      console.error('Error rendering users:', err);
    }
  }
  
  if(adminUsersTable) await renderUsers();
  
  if(userForm){
    userForm.addEventListener('submit',async(e)=>{
      e.preventDefault();
      const username=document.getElementById('u_username').value;
      
      try {
        await api(`/users/${username}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: document.getElementById('u_name').value.trim(),
            email: document.getElementById('u_email').value.trim(),
            phone: document.getElementById('u_phone').value.trim(),
            institucion: document.getElementById('u_inst').value.trim(),
            cat: document.getElementById('u_cat').value,
            role: document.getElementById('u_role').value,
            status: document.getElementById('u_status').value
          })
        });
        
        openModal('modalUser', false);
        await renderUsers();
        await fillTop();
        toast('Usuario actualizado.','success');
      } catch (err) {
        toast('Error al actualizar usuario.','error');
      }
    });
    
    document.querySelectorAll('[data-close-user]').forEach(x=>x.addEventListener('click',()=>openModal('modalUser',false)));
  }

  const adminAnTable=document.getElementById('adminAnunciosTable');
  const modalAn=document.getElementById('modalAnuncio');
  const anuncioForm=document.getElementById('anuncioForm');
  const btnNuevoAn=document.getElementById('btnNuevoAnuncio');
  
  async function renderAnunciosAdmin(){
    if(!adminAnTable) return;
    const tb=adminAnTable.querySelector('tbody');
    
    try {
      const list = await api('/anuncios');
      tb.innerHTML=list.map(a=>`<tr><td>${a.img?`<img src='${a.img}' class='thumb' style='width:60px;height:60px;border-radius:8px;border:1px solid var(--border);object-fit:cover;'>`:''}</td><td>${a.titulo}</td><td>${a.fecha}</td><td>${a.texto}</td><td><button class='btn sm' data-edit-an='${a.id}'>Editar</button> <button class='btn sm danger' data-del-an='${a.id}'>Eliminar</button></td></tr>`).join('');
      
      tb.querySelectorAll('[data-edit-an]').forEach(b=>b.addEventListener('click',()=>openAnuncio(b.getAttribute('data-edit-an'))));
      tb.querySelectorAll('[data-del-an]').forEach(b=>b.addEventListener('click',async()=>{
        const id=b.getAttribute('data-del-an');
        try {
          await api(`/anuncios/${id}`, {method: 'DELETE'});
          await renderAnunciosAdmin();
          await renderAnunciosMain();
          toast('Anuncio eliminado.','info');
        } catch (err) {
          toast('Error al eliminar anuncio.','error');
        }
      }));
    } catch (err) {
      console.error('Error rendering anuncios admin:', err);
    }
  }
  
  async function openAnuncio(id){
    try {
      const list = await api('/anuncios');
      const a=list.find(x=>x.id===id)||{id:'',titulo:'',fecha:'',texto:'',img:'',global:true};
      
      document.getElementById('anuncioId').value=a.id;
      document.getElementById('anuncioTitulo').value=a.titulo||'';
      document.getElementById('anuncioFecha').value=a.fecha||'';
      document.getElementById('anuncioTexto').value=a.texto||'';
      document.getElementById('anuncioPreview').src=a.img||'';
      
      const globalCheckbox = document.getElementById('anuncioGlobal');
      if(globalCheckbox) {
        globalCheckbox.checked = a.global !== false;
      }
      
      modalAn.style.display='flex';
    } catch (err) {
      console.error('Error opening anuncio:', err);
    }
  }
  
  if(btnNuevoAn) btnNuevoAn.addEventListener('click',()=>openAnuncio(''));
  
  if(anuncioForm){
    document.getElementById('anuncioImg').addEventListener('change',(e)=>{
      const f=e.target.files[0];
      if(!f) return;
      const r=new FileReader();
      r.onload=()=>{document.getElementById('anuncioPreview').src=r.result;};
      r.readAsDataURL(f);
    });
    
    document.getElementById('btnAnuncioQuitarImg').addEventListener('click',()=>{
      document.getElementById('anuncioPreview').src='';
    });
    
    anuncioForm.addEventListener('submit',async(e)=>{
      e.preventDefault();
      
      const globalCheckbox = document.getElementById('anuncioGlobal');
      const obj={
        id: document.getElementById('anuncioId').value||undefined,
        titulo: document.getElementById('anuncioTitulo').value.trim(),
        fecha: document.getElementById('anuncioFecha').value||new Date().toISOString().slice(0,10),
        texto: document.getElementById('anuncioTexto').value.trim(),
        img: document.getElementById('anuncioPreview').src||'',
        global: globalCheckbox ? globalCheckbox.checked : true
      };
      
      try {
        await api('/anuncios', {
          method: 'POST',
          body: JSON.stringify(obj)
        });
        
        modalAn.style.display='none';
        await renderAnunciosAdmin();
        await renderAnunciosMain();
        toast('Anuncio guardado.','success');
      } catch (err) {
        toast('Error al guardar anuncio.','error');
      }
    });
    
    document.querySelectorAll('[data-close-anuncio]').forEach(x=>x.addEventListener('click',()=>modalAn.style.display='none'));
  }
  
  if(adminAnTable) await renderAnunciosAdmin();

  const adminGTable=document.getElementById('adminGuiasTable');
  const modalG=document.getElementById('modalGuia');
  const guiaForm=document.getElementById('guiaForm');
  const btnNuevaG=document.getElementById('btnNuevaGuia');
  
  async function renderGuiasAdmin(){
    if(!adminGTable) return;
    const tb=adminGTable.querySelector('tbody');
    
    try {
      const list = await api('/guias');
      tb.innerHTML=list.map(g=>`<tr><td>${g.titulo}</td><td>${g.fecha}</td><td>${g.texto}</td><td>${g.url?`<a href='${g.url}' target='_blank'>Abrir</a>`:''}</td><td><button class='btn sm' data-edit-g='${g.id}'>Editar</button> <button class='btn sm danger' data-del-g='${g.id}'>Eliminar</button></td></tr>`).join('');
      
      tb.querySelectorAll('[data-edit-g]').forEach(b=>b.addEventListener('click',()=>openGuia(b.getAttribute('data-edit-g'))));
      tb.querySelectorAll('[data-del-g]').forEach(b=>b.addEventListener('click',async()=>{
        const id=b.getAttribute('data-del-g');
        try {
          await api(`/guias/${id}`, {method: 'DELETE'});
          await renderGuiasAdmin();
          await renderGuiasMain();
          toast('Guía eliminada.','info');
        } catch (err) {
          toast('Error al eliminar guía.','error');
        }
      }));
    } catch (err) {
      console.error('Error rendering guias admin:', err);
    }
  }
  
  async function openGuia(id){
    try {
      const list = await api('/guias');
      const g=list.find(x=>x.id===id)||{id:'',titulo:'',fecha:'',texto:'',url:'',global:true};
      
      document.getElementById('guiaId').value=g.id;
      document.getElementById('guiaTitulo').value=g.titulo||'';
      document.getElementById('guiaFecha').value=g.fecha||'';
      document.getElementById('guiaTexto').value=g.texto||'';
      document.getElementById('guiaURL').value=g.url||'';
      
      const globalCheckbox = document.getElementById('guiaGlobal');
      if(globalCheckbox) {
        globalCheckbox.checked = g.global !== false;
      }
      
      modalG.style.display='flex';
    } catch (err) {
      console.error('Error opening guia:', err);
    }
  }
  
  if(btnNuevaG) btnNuevaG.addEventListener('click',()=>openGuia(''));
  
  if(guiaForm){
    guiaForm.addEventListener('submit',async(e)=>{
      e.preventDefault();
      
      const globalCheckbox = document.getElementById('guiaGlobal');
      const g={
        id: document.getElementById('guiaId').value||undefined,
        titulo: document.getElementById('guiaTitulo').value.trim(),
        fecha: document.getElementById('guiaFecha').value||new Date().toISOString().slice(0,10),
        texto: document.getElementById('guiaTexto').value.trim(),
        url: document.getElementById('guiaURL').value.trim(),
        global: globalCheckbox ? globalCheckbox.checked : true
      };
      
      try {
        await api('/guias', {
          method: 'POST',
          body: JSON.stringify(g)
        });
        
        modalG.style.display='none';
        await renderGuiasAdmin();
        await renderGuiasMain();
        toast('Guía guardada.','success');
      } catch (err) {
        toast('Error al guardar guía.','error');
      }
    });
    
    document.querySelectorAll('[data-close-guia]').forEach(x=>x.addEventListener('click',()=>modalG.style.display='none'));
  }
  
  if(adminGTable) await renderGuiasAdmin();

  async function renderAnunciosMain(){
    const cont=document.getElementById('anunciosList');
    if(!cont) return;
    
    try {
      const list = await api('/anuncios');
      const sorted = list.sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||''));
      cont.innerHTML=sorted.map(a=>`<article class='glass' style='padding:10px;border-radius:12px;display:flex;gap:10px;align-items:flex-start'>${a.img?`<img src='${a.img}' alt='' style='width:72px;height:72px;border-radius:10px;border:1px solid var(--border);object-fit:cover;'>`:''}<div><div style='display:flex;gap:8px;align-items:center'><strong>${a.titulo}</strong><span class='chip'>${a.fecha}</span></div><div class='text-muted'>${a.texto}</div></div></article>`).join('');
    } catch (err) {
      console.error('Error rendering anuncios main:', err);
    }
  }
  
  async function renderGuiasMain(){
    const cont=document.getElementById('guiasList');
    if(!cont) return;
    
    try {
      const list = await api('/guias');
      const sorted = list.sort((a,b)=>(b.fecha||'').localeCompare(a.fecha||''));
      cont.innerHTML=sorted.map(g=>`<div class='glass' style='padding:10px;border-radius:12px'><div style='display:flex;gap:8px;align-items:center'><strong>${g.titulo}</strong><span class='chip'>${g.fecha}</span></div><div class='text-muted'>${g.texto}</div>${g.url?`<div class='mt12'><a class='btn sm' target='_blank' href='${g.url}'>Abrir</a></div>`:''}</div>`).join('');
    } catch (err) {
      console.error('Error rendering guias main:', err);
    }
  }
  
  await renderAnunciosMain();
  await renderGuiasMain();

  const drugTable = document.getElementById('drugTable');
  const drugSearch = document.getElementById('drugSearch');
  
  async function renderDrugs(filter='') {
    if(!drugTable) return;
    const tbody = drugTable.querySelector('tbody');
    
    try {
      const list = await api('/medications');
      const filtered = filter ? list.filter(d => 
        d.nombre.toLowerCase().includes(filter.toLowerCase()) ||
        d.grupo.toLowerCase().includes(filter.toLowerCase()) ||
        d.comentarios.toLowerCase().includes(filter.toLowerCase())
      ) : list;
      
      tbody.innerHTML = filtered.sort((a,b)=>a.nombre.localeCompare(b.nombre)).map(d => 
        `<tr><td><strong>${d.nombre}</strong></td><td>${d.grupo}</td><td>${d.dilucion}</td><td class='text-muted'>${d.comentarios}</td></tr>`
      ).join('');
    } catch (err) {
      console.error('Error rendering drugs:', err);
    }
  }
  
  if(drugSearch) {
    drugSearch.addEventListener('input', (e) => renderDrugs(e.target.value));
  }
  await renderDrugs();

  const adminMedsTable = document.getElementById('adminMedicamentosTable');
  const modalMed = document.getElementById('modalMedicamento');
  const medForm = document.getElementById('medicamentoForm');
  const btnNuevoMed = document.getElementById('btnNuevoMedicamento');
  
  async function renderMedsAdmin() {
    if(!adminMedsTable) return;
    const tbody = adminMedsTable.querySelector('tbody');
    
    try {
      const list = await api('/medications');
      tbody.innerHTML = list.sort((a,b)=>a.nombre.localeCompare(b.nombre)).map(m => 
        `<tr><td>${m.nombre}</td><td>${m.grupo}</td><td>${m.dilucion}</td><td>${m.comentarios}</td><td><button class='btn sm' data-edit-med='${m.id}'>Editar</button> <button class='btn sm danger' data-del-med='${m.id}'>Eliminar</button></td></tr>`
      ).join('');
      
      tbody.querySelectorAll('[data-edit-med]').forEach(b => b.addEventListener('click', () => openMedicamento(b.getAttribute('data-edit-med'))));
      tbody.querySelectorAll('[data-del-med]').forEach(b => b.addEventListener('click', async () => {
        const id = b.getAttribute('data-del-med');
        if(!confirm('¿Eliminar este medicamento?')) return;
        
        try {
          await api(`/medications/${id}`, {method: 'DELETE'});
          await renderMedsAdmin();
          await renderDrugs();
          toast('Medicamento eliminado.', 'info');
        } catch (err) {
          toast('Error al eliminar medicamento.', 'error');
        }
      }));
    } catch (err) {
      console.error('Error rendering meds admin:', err);
    }
  }
  
  async function openMedicamento(id) {
    try {
      const list = await api('/medications');
      const m = list.find(x => x.id === id) || {id:'', nombre:'', grupo:'', dilucion:'', comentarios:''};
      
      document.getElementById('medId').value = m.id;
      document.getElementById('medNombre').value = m.nombre || '';
      document.getElementById('medGrupo').value = m.grupo || '';
      document.getElementById('medDilucion').value = m.dilucion || '';
      document.getElementById('medComentarios').value = m.comentarios || '';
      modalMed.style.display = 'flex';
    } catch (err) {
      console.error('Error opening medicamento:', err);
    }
  }
  
  if(btnNuevoMed) btnNuevoMed.addEventListener('click', () => openMedicamento(''));
  
  if(medForm) {
    medForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const obj = {
        id: document.getElementById('medId').value||undefined,
        nombre: document.getElementById('medNombre').value.trim(),
        grupo: document.getElementById('medGrupo').value.trim(),
        dilucion: document.getElementById('medDilucion').value.trim(),
        comentarios: document.getElementById('medComentarios').value.trim()
      };
      
      try {
        await api('/medications', {
          method: 'POST',
          body: JSON.stringify(obj)
        });
        
        modalMed.style.display = 'none';
        await renderMedsAdmin();
        await renderDrugs();
        toast('Medicamento guardado.', 'success');
      } catch (err) {
        toast('Error al guardar medicamento.', 'error');
      }
    });
    
    document.querySelectorAll('[data-close-med]').forEach(x => x.addEventListener('click', () => modalMed.style.display = 'none'));
  }
  
  if(adminMedsTable) await renderMedsAdmin();
})();

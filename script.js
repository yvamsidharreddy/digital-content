const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const menuList = document.getElementById('menuList');
const contentArea = document.getElementById('content-area');
const breadcrumb = document.getElementById('breadcrumb');
let mobileOpen = false;

toggleBtn.addEventListener('click', ()=>{
  if(window.innerWidth <= 800){
    mobileOpen = !mobileOpen;
    sidebar.classList.toggle('open', mobileOpen);
  } else {
    sidebar.classList.toggle('collapsed');
  }
});

menuList.addEventListener('click', (e)=>{
  const li = e.target.closest('li');
  if(!li) return;
  menuList.querySelectorAll('li').forEach(n => n.classList.remove('active'));
  li.classList.add('active');
  loadContent(li.dataset.file);
});

async function loadContent(file){
  try{
    const res = await fetch(file);
    if(!res.ok) throw new Error('Not found');
    const html = await res.text();
    contentArea.innerHTML = html;
    updateBreadcrumb(file);
    if(window.innerWidth <= 800) { sidebar.classList.remove('open'); mobileOpen=false; }
    runInlineScripts(contentArea);
  }catch{
    contentArea.innerHTML = "<h3>Error</h3><p>Could not load content.</p>";
    breadcrumb.textContent = "Error";
  }
}

function updateBreadcrumb(file){
  if(file === 'home.html'){ breadcrumb.textContent = 'Home'; return; }
  const name = file.replace('.html','').replace(/-/g,' ').replace(/unit/ig,'Unit ');
  breadcrumb.textContent = 'Home > ' + name.charAt(0).toUpperCase() + name.slice(1);
}

function runInlineScripts(container){
  const scripts = container.querySelectorAll('script');
  scripts.forEach(s => {
    try { new Function(s.textContent)(); } catch(e) { console.warn('Script error', e); }
  });
}

document.addEventListener('DOMContentLoaded', ()=>loadContent('home.html'));
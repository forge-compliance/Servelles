const requests = [
  {id:1, room:'18', type:'housekeeping', category:'Towels', icon:'▤', message:'Hi, could we have another couple of bath towels please?', department:'Housekeeping', status:'new', received:'09:28', ago:'2 min ago', guest:'Mr. James Anderson'},
  {id:2, room:'22', type:'roomservice', category:'Beverages', icon:'♨', message:'Can we have a bottle of Sauvignon Blanc please?', department:'Room Service', status:'new', received:'09:30', ago:'5 min ago', guest:'Ms. Claire Baker', price:32.00},
  {id:3, room:'31', type:'engineering', category:'Hot water', icon:'⚒', message:"The shower isn't getting hot this morning.", department:'Engineering', status:'new', received:'09:33', ago:'8 min ago', guest:'Mr. David Cole'},
  {id:4, room:'7', type:'concierge', category:'Transport', icon:'◈', message:'Could you book us a taxi to the airport for 7am tomorrow?', department:'Concierge', status:'new', received:'09:34', ago:'9 min ago', guest:'Mrs. Helen Morris'},
  {id:5, room:'14', type:'housekeeping', category:'Pillows', icon:'▤', message:'Two firmer pillows please.', department:'Housekeeping', status:'active', received:'09:18', ago:'23 min ago', guest:'Mr. Patel', accepted:'09:21'},
  {id:6, room:'22', type:'roomservice', category:'Room Service', icon:'♨', message:'2 club sandwiches, fries and two cokes please.', department:'Room Service', status:'active', received:'09:30', ago:'11 min ago', guest:'Ms. Claire Baker', accepted:'09:32', price:42.50, order:true, pos:true, billed:true, kitchen:true},
  {id:7, room:'4', type:'housekeeping', category:'Amenities', icon:'▤', message:'Extra shower gel please.', department:'Housekeeping', status:'completed', received:'08:50', accepted:'08:52', completed:'09:01', guest:'Mr. Lewis'},
  {id:8, room:'26', type:'engineering', category:'Lighting', icon:'⚒', message:'Bedside lamp not working.', department:'Engineering', status:'completed', received:'08:41', accepted:'08:45', completed:'09:06', guest:'Mrs. Day'},
  {id:9, room:'11', type:'concierge', category:'Luggage', icon:'◈', message:'Can someone collect our luggage please?', department:'Concierge', status:'completed', received:'08:30', accepted:'08:31', completed:'08:40', guest:'Mr. Fraser'}
];

const views = ['home','new','active','completed','placeholder'];
function showView(name){
  views.forEach(v=>document.getElementById(v+'View')?.classList.toggle('active-view',v===name));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.nav===name || (name==='active'&&n.dataset.nav==='new') || (name==='completed'&&n.dataset.nav==='new')));
  if(name==='new'||name==='active'||name==='completed') renderLists();
}

document.querySelectorAll('[data-open-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.openView)));
document.querySelectorAll('.nav-item').forEach(b=>b.addEventListener('click',()=>{
  const nav=b.dataset.nav;
  if(nav==='home'||nav==='new') showView(nav);
  else if(nav==='orders') {showView('active');}
  else {showPlaceholder(nav)}
}));

function showPlaceholder(name){
  const titles={conversations:'Conversations',guests:'Guest Directory',reports:'Reports & Service Levels',team:'Team',settings:'Settings'};
  document.getElementById('placeholderTitle').textContent=titles[name]||'Coming Soon';
  document.getElementById('placeholderCopy').textContent='This module is laid out for the next build stage. The live request workflow is working in this prototype.';
  showView('placeholder');
}

function requestCard(r){
  const active=r.status==='active';
  const completed=r.status==='completed';
  return `<article class="request-card">
    <div class="request-meta">
      <div class="request-icon ${r.type}">${r.icon}</div>
      <div class="request-copy">
        <h3>ROOM ${r.room} <span class="time">${completed?`Completed ${r.completed}`:r.ago||''}</span>${active?'<span class="status-pill">IN PROGRESS</span>':''}</h3>
        <blockquote>“${r.message}”</blockquote>
        <div class="suggested">${active||completed?'Department':'Suggested'}: ${r.department} · ${r.category}${r.price?` · <span class="price">£${r.price.toFixed(2)}</span>`:''}</div>
      </div>
    </div>
    <div class="request-actions">
      ${r.status==='new'?`<button class="action-btn" onclick="confirmRequest(${r.id})">✓ CONFIRM</button><button class="action-btn dark" onclick="openTransfer(${r.id})">→ TRANSFER</button><button class="action-btn dark" onclick="openReply(${r.id})">◌ REPLY</button>`:''}
      ${r.status==='active'?`<button class="action-btn" onclick="openRequest(${r.id})">OPEN</button><button class="action-btn dark" onclick="openReply(${r.id})">◌ REPLY</button><button class="action-btn dark" onclick="completeRequest(${r.id})">✓ COMPLETE</button>`:''}
      ${r.status==='completed'?`<button class="action-btn dark" onclick="openRequest(${r.id})">VIEW HISTORY</button>`:''}
    </div>
  </article>`;
}

function renderLists(){
  document.getElementById('newRequestsList').innerHTML=requests.filter(r=>r.status==='new').map(requestCard).join('')||'<div class="placeholder-card">No new requests.</div>';
  document.getElementById('activeRequestsList').innerHTML=requests.filter(r=>r.status==='active').map(requestCard).join('')||'<div class="placeholder-card">No active requests.</div>';
  document.getElementById('completedRequestsList').innerHTML=requests.filter(r=>r.status==='completed').map(requestCard).join('')||'<div class="placeholder-card">Nothing completed yet.</div>';
  document.getElementById('newCount').textContent=requests.filter(r=>r.status==='new').length;
  document.getElementById('activeCount').textContent=requests.filter(r=>r.status==='active').length;
  document.getElementById('completedCount').textContent=requests.filter(r=>r.status==='completed').length;
}

function openRequest(id){
  const r=requests.find(x=>x.id===id); if(!r)return;
  document.getElementById('drawerTitle').textContent=`Room ${r.room} · ${r.category}`;
  const orderBlock=r.order?`<div class="detail-panel"><h4>Order progress</h4><div class="order-track">
    <div class="step done">Received</div><div class="step done">Confirmed</div><div class="step ${r.pos?'done':''}">Sent to POS</div><div class="step current">In Kitchen</div><div class="step">Ready</div><div class="step">Delivered</div><div class="step">Completed</div>
  </div><div class="detail-grid"><div><div class="label">Order total</div><div class="price">£${r.price.toFixed(2)}</div></div><div><div class="label">Billing</div><p>${r.pos?'✓ Sent to POS':'Awaiting POS'}<br>${r.billed?'✓ Charged to room':'Awaiting charge'}<br>${r.kitchen?'✓ Kitchen ticket #1842':'Awaiting kitchen ticket'}</p></div></div></div>`:'';
  document.getElementById('drawerContent').innerHTML=`
    <div class="detail-panel"><span class="small-label">ROOM ${r.room}</span><h2 style="font-size:34px;margin:4px 0 8px">${r.category}</h2><div class="guest-message">${r.message}</div></div>
    <div class="detail-grid" style="margin-top:18px">
      <div class="detail-panel"><h4>Request information</h4><p><b>Department:</b> ${r.department}<br><b>Guest:</b> ${r.guest}<br><b>Received:</b> ${r.received}${r.accepted?`<br><b>Accepted:</b> ${r.accepted}`:''}${r.completed?`<br><b>Completed:</b> ${r.completed}`:''}</p></div>
      <div class="detail-panel"><h4>Actions</h4>${r.status==='new'?`<button class="action-btn" onclick="confirmRequest(${r.id})">✓ CONFIRM & ASSIGN</button>`:''}<button class="action-btn dark" onclick="openTransfer(${r.id})">→ TRANSFER</button><button class="action-btn dark" onclick="openReply(${r.id})">◌ REPLY TO GUEST</button>${r.status==='active'?`<button class="action-btn" onclick="completeRequest(${r.id})">✓ COMPLETE REQUEST</button>`:''}<button class="action-btn danger">⚑ MARK AS URGENT</button></div>
    </div>
    ${orderBlock}
    <div class="detail-panel" style="margin-top:18px"><h4>Activity timeline</h4><div class="timeline"><div class="timeline-row"><span>${r.received}</span><span class="dot"></span><span>Request received via WhatsApp</span></div>${r.accepted?`<div class="timeline-row"><span>${r.accepted}</span><span class="dot"></span><span>Accepted by Sophie · ${r.department}</span></div>`:''}${r.completed?`<div class="timeline-row"><span>${r.completed}</span><span class="dot"></span><span>Request completed</span></div>`:''}</div></div>`;
  openDrawer();
}
function openDrawer(){document.getElementById('requestDrawer').classList.remove('hidden');document.getElementById('drawerOverlay').classList.remove('hidden')}
function closeDrawer(){document.getElementById('requestDrawer').classList.add('hidden');document.getElementById('drawerOverlay').classList.add('hidden')}
document.getElementById('closeDrawer').onclick=closeDrawer;document.getElementById('drawerOverlay').onclick=closeDrawer;

function confirmRequest(id){const r=requests.find(x=>x.id===id);if(!r)return;r.status='active';r.accepted='09:41';renderLists();openRequest(id)}
function completeRequest(id){const r=requests.find(x=>x.id===id);if(!r)return;if(r.price&&!r.billed){alert('Charge must be posted before this request can be completed.');openRequest(id);return;}r.status='completed';r.completed='09:42';renderLists();closeDrawer();showView('completed')}

function openTransfer(id){
  const r=requests.find(x=>x.id===id);if(!r)return;
  const depts=['Housekeeping','Room Service','Engineering','Spa','Concierge','Front Office','Duty Manager'];
  document.getElementById('modalTitle').textContent='Transfer to Department';
  document.getElementById('modalBody').innerHTML=`<div class="dept-list">${depts.map(d=>`<button class="dept" onclick="transferRequest(${id},'${d.replace(/'/g,"\\'")}')"><span><b>${d}</b><br><small>${deptSub(d)}</small></span><span>→</span></button>`).join('')}</div>`;
  openModal();
}
function deptSub(d){return {Housekeeping:'Towels, amenities, cleaning','Room Service':'Food & beverage orders',Engineering:'Maintenance & repairs',Spa:'Spa & wellness requests',Concierge:'Transport, bookings, information','Front Office':'General guest enquiries','Duty Manager':'Urgent / escalation'}[d]||''}
function transferRequest(id,dept){const r=requests.find(x=>x.id===id);r.department=dept;r.status='active';r.accepted='09:41';closeModal();renderLists();openRequest(id)}

function openReply(id){
  const r=requests.find(x=>x.id===id);if(!r)return;
  document.getElementById('modalTitle').textContent=`Reply to Room ${r.room}`;
  document.getElementById('modalBody').innerHTML=`<div class="reply-box"><div class="guest-message">${r.message}</div><textarea id="replyText" rows="5" placeholder="Type your reply to the guest..."></textarea><button class="primary-btn" style="width:100%;margin-top:12px" onclick="sendReply(${id})">SEND VIA WHATSAPP</button></div>`;
  openModal();
}
function sendReply(id){const text=document.getElementById('replyText').value.trim();if(!text){alert('Type a reply first.');return;}closeModal();alert('Prototype: reply queued to WhatsApp.');}
function openModal(){document.getElementById('modal').classList.remove('hidden');document.getElementById('modalOverlay').classList.remove('hidden')}
function closeModal(){document.getElementById('modal').classList.add('hidden');document.getElementById('modalOverlay').classList.add('hidden')}
document.getElementById('closeModal').onclick=closeModal;document.getElementById('modalOverlay').onclick=closeModal;

function manualRequest(){
  document.getElementById('modalTitle').textContent='New Manual Request';
  document.getElementById('modalBody').innerHTML=`<div class="manual-form"><label class="label">Room<input id="manualRoom" placeholder="e.g. 12"></label><label class="label">Department<select id="manualDept"><option>Housekeeping</option><option>Room Service</option><option>Engineering</option><option>Concierge</option><option>Spa</option><option>Front Office</option></select></label><label class="label">Request<textarea id="manualMessage" rows="4" placeholder="What does the guest need?"></textarea></label><button class="primary-btn" onclick="createManualRequest()">CREATE REQUEST</button></div>`;
  openModal();
}
function createManualRequest(){const room=document.getElementById('manualRoom').value.trim();const message=document.getElementById('manualMessage').value.trim();const dept=document.getElementById('manualDept').value;if(!room||!message){alert('Add the room and request.');return;}requests.unshift({id:Date.now(),room,type:dept==='Engineering'?'engineering':dept==='Room Service'?'roomservice':dept==='Concierge'?'concierge':'housekeeping',category:'Manual request',icon:'＋',message,department:dept,status:'new',received:'09:42',ago:'just now',guest:'Guest'});closeModal();renderLists();showView('new')}
document.getElementById('manualRequestBtn').onclick=manualRequest;

renderLists();
window.openRequest=openRequest;window.confirmRequest=confirmRequest;window.completeRequest=completeRequest;window.openTransfer=openTransfer;window.transferRequest=transferRequest;window.openReply=openReply;window.sendReply=sendReply;window.createManualRequest=createManualRequest;

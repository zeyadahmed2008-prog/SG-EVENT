let events = JSON.parse(localStorage.getItem('events') || '[]');
let invitationHistory = JSON.parse(localStorage.getItem('invitationHistory') || '[]');

const eventSelect = document.getElementById('eventSelect');
const createInvitationSection = document.getElementById('create-invitation');
const invitationResult = document.getElementById('invitationResult');
const historyList = document.getElementById('historyList');

function saveEvents() {
  localStorage.setItem('events', JSON.stringify(events));
}
function saveInvitationHistory() {
  localStorage.setItem('invitationHistory', JSON.stringify(invitationHistory));
}

function refreshEventSelect() {
  eventSelect.innerHTML = '';
  events.forEach((event, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = event.name + ' (' + event.date + ')';
    eventSelect.appendChild(option);
  });
  createInvitationSection.style.display = events.length > 0 ? 'block' : 'none';
}

function refreshHistoryList() {
  historyList.innerHTML = '';
  if (invitationHistory.length === 0) {
    historyList.innerHTML = '<li>No invitations yet.</li>';
    return;
  }
  invitationHistory.forEach((inv, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${inv.guestName} - ${inv.eventName} 
      <button onclick="window.open('${inv.url}','_blank')">Open</button>`;
    historyList.appendChild(li);
  });
}

document.getElementById('saveEvent').addEventListener('click', () => {
  const name = document.getElementById('eventName').value.trim();
  const venue = document.getElementById('venue').value.trim();
  const description = document.getElementById('description').value.trim();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const dressCode = document.getElementById('dressCode').value.trim();

  if (!name || !venue || !date || !time) {
    alert('Fill all required fields.');
    return;
  }

  events.push({ name, venue, description, date, time, dressCode });
  saveEvents();
  refreshEventSelect();

  alert('Event saved!');
});

document.getElementById('generateInvitation').addEventListener('click', () => {
  const guestName = document.getElementById('guestName').value.trim();
  const eventIndex = eventSelect.value;
  if (!guestName) { alert('Guest name required'); return; }
  const event = events[eventIndex];
  if (!event) { alert('Select event'); return; }

  const payload = { ...event, guest: guestName };
  const json = JSON.stringify(payload);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  const url = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, "/") + "invite.html?data=" + encodeURIComponent(b64);

  invitationResult.innerHTML = `<pre>${json}</pre><div id="qrcode"></div>`;
  new QRCode(document.getElementById("qrcode"), url);

  invitationHistory.push({ guestName, eventName: event.name, url });
  saveInvitationHistory();
  refreshHistoryList();
});

document.getElementById('changePass').addEventListener('click', () => {
  const newPass = document.getElementById('newPass').value.trim();
  if(!newPass){ alert("Enter new password"); return; }
  localStorage.setItem("sg_password", newPass);
  alert("Password updated!");
});

// Init
refreshEventSelect();
refreshHistoryList();

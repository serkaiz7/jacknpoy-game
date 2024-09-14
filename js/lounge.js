// js/lounge.js

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
});

// Chat functionality
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Send Message
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const message = chatInput.value.trim();
  if (message === '') return;

  const user = auth.currentUser;
  if (user) {
    const chatRef = db.ref('chat');
    const newMessage = {
      user: user.email,
      message: message,
      timestamp: Date.now()
    };
    chatRef.push(newMessage);
    chatInput.value = '';
  }
}

// Receive Messages
db.ref('chat').on('child_added', (snapshot) => {
  const msg = snapshot.val();
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  msgDiv.innerHTML = `<strong>${msg.user}:</strong> ${msg.message}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Game Rooms
const roomsList = document.getElementById('rooms-list');
const createRoomBtn = document.getElementById('create-room-btn');
const roomNameInput = document.getElementById('room-name');

// Create Room
createRoomBtn.addEventListener('click', () => {
  const roomName = roomNameInput.value.trim();
  if (roomName === '') return;

  const roomRef = db.ref('rooms/' + roomName);
  roomRef.set({
    creator: auth.currentUser.email,
    players: [auth.currentUser.email]
  });

  // Redirect to game page with room name
  window.location.href = `game.html?room=${roomName}`;
});

// Display Rooms
db.ref('rooms').on('value', (snapshot) => {
  roomsList.innerHTML = '';
  snapshot.forEach((child) => {
    const room = child.val();
    const roomDiv = document.createElement('div');
    roomDiv.classList.add('room');
    roomDiv.innerHTML = `
      <span>${child.key}</span>
      <button data-room="${child.key}">Join</button>
    `;
    roomsList.appendChild(roomDiv);
  });

  // Add event listeners to Join buttons
  const joinButtons = document.querySelectorAll('button[data-room]');
  joinButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const roomName = btn.getAttribute('data-room');
      const roomRef = db.ref('rooms/' + roomName + '/players');
      roomRef.once('value').then((snapshot) => {
        const players = snapshot.val();
        if (players.length < 2) {
          roomRef.push(auth.currentUser.email);
          window.location.href = `game.html?room=${roomName}`;
        } else {
          alert('Room is full!');
        }
      });
    });
  });
});

// Invite Friend
const inviteBtn = document.getElementById('invite-btn');
const inviteEmail = document.getElementById('invite-email');

inviteBtn.addEventListener('click', () => {
  const email = inviteEmail.value.trim();
  if (email === '') return;
  // Simple email invite (In real app, use email service)
  alert(`Invite sent to ${email}!`);
  inviteEmail.value = '';
});

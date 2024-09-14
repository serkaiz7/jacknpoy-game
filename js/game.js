// js/game.js

// Get URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get('room');

const exitBtn = document.getElementById('exit-btn');
const yourScoreEl = document.getElementById('your-score');
const opponentScoreEl = document.getElementById('opponent-score');
const statusEl = document.getElementById('status');
const moveButtons = document.querySelectorAll('.move-btn');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const backgroundSound = document.getElementById('background-sound');

let yourScore = 0;
let opponentScore = 0;
let gameActive = false;

let playerMove = null;
let opponentMove = null;

// Start Background Sound
backgroundSound.play();

// Exit Game
exitBtn.addEventListener('click', () => {
  // Remove player from room
  const playerRef = db.ref(`rooms/${roomName}/players`);
  playerRef.once('value').then((snapshot) => {
    const players = snapshot.val();
    const userEmail = auth.currentUser.email;
    for (let key in players) {
      if (players[key] === userEmail) {
        db.ref(`rooms/${roomName}/players/${key}`).remove();
        break;
      }
    }
    window.location.href = 'lounge.html';
  });
});

// Play/Pause Controls
playBtn.addEventListener('click', () => {
  backgroundSound.play();
});

pauseBtn.addEventListener('click', () => {
  backgroundSound.pause();
});

// Handle Move Selection
moveButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!gameActive) {
      alert('Game is not active!');
      return;
    }
    playerMove = btn.getAttribute('data-move');
    submitMove(playerMove);
  });
});

// Submit Move to Database
function submitMove(move) {
  const user = auth.currentUser;
  if (user) {
    db.ref(`rooms/${roomName}/moves/${user.uid}`).set(move);
  }
}

// Listen for Opponent's Move
db.ref(`rooms/${roomName}/moves`).on('value', (snapshot) => {
  const moves = snapshot.val();
  if (!moves) return;

  const players = Object.keys(moves);
  if (players.length < 2) {
    statusEl.textContent = 'Waiting for opponent...';
    return;
  }

  const [player1, player2] = players;
  const move1 = moves[player1];
  const move2 = moves[player2];

  if (move1 && move2) {
    determineWinner(move1, move2);
    // Reset moves
    db.ref(`rooms/${roomName}/moves`).set({});
  }
});

// Determine Winner
function determineWinner(moveA, moveB) {
  const user = auth.currentUser;
  const playersRef = db.ref(`rooms/${roomName}/players`);
  playersRef.once('value').then((snapshot) => {
    const players = snapshot.val();
    const emails = Object.values(players);
    const indexA = Object.keys(players).find(key => players[key] === playersRef.orderByKey().toString());
    const indexB = Object.keys(players).find(key => players[key] !== playersRef.orderByKey().toString());

    const [playerA, playerB] = emails;

    let result = '';
    if (moveA === moveB) {
      result = "It's a tie!";
    } else if (
      (moveA === 'rock' && moveB === 'scissors') ||
      (moveA === 'paper' && moveB === 'rock') ||
      (moveA === 'scissors' && moveB === 'paper')
    ) {
      result = `${playerA} wins!`;
      if (playerA === user.email) {
        yourScore++;
        yourScoreEl.textContent = yourScore;
      } else {
        opponentScore++;
        opponentScoreEl.textContent = opponentScore;
      }
    } else {
      result = `${playerB} wins!`;
      if (playerB === user.email) {
        yourScore++;
        yourScoreEl.textContent = yourScore;
      } else {
        opponentScore++;
        opponentScoreEl.textContent = opponentScore;
      }
    }
    statusEl.textContent = result;
  });
}

// Activate Game
gameActive = true;
statusEl.textContent = 'Game Started! Make your move.';

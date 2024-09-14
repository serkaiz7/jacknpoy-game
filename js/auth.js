// js/auth.js

// Toggle between Login and Register forms
const showLogin = document.getElementById('show-login');
const showRegister = document.getElementById('show-register');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
});

showRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});

// Register User
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Registration successful
      window.location.href = 'lounge.html';
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Login User
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login successful
      window.location.href = 'lounge.html';
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Check Auth State
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    // Optionally, redirect to lounge.html if on index.html
    // window.location.href = 'lounge.html';
  } else {
    // No user is signed in
  }
});

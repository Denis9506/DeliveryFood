const modalAuth = document.querySelector('.modal-auth');
const buttonAuth = document.querySelector('.button-auth');
const buttonOut = document.querySelector('.button-out');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password'); 
const userName = document.querySelector('.user-name');
const buttonLogin = document.querySelector('.button-login');
const modalOverlay = document.querySelector('.modal-overlay'); 

function openModalAuth() {
  modalAuth.classList.add('is-open');
  document.body.style.overflow = 'hidden'; 
}

function closeModalAuth() {
  modalAuth.classList.remove('is-open');
  document.body.style.overflow = ''; 
}

function checkAuth() {
  const login = localStorage.getItem('login');
  if (login) {
    logIn(login);
  } else {
    logOut();
  }
}

function logIn(login) {
  userName.textContent = login;
  userName.style.display = 'inline';
  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'block';
  closeModalAuth();
}

function logOut() {
  localStorage.removeItem('login');
  userName.textContent = '';
  userName.style.display = 'none';
  buttonAuth.style.display = 'block';
  buttonOut.style.display = 'none';
}

function markInvalidField(field) {
  field.classList.add('error');
}

function clearInvalidField(field) {
  field.classList.remove('error');
}

logInForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let valid = true;

  if (!loginInput.value.trim()) {
    markInvalidField(loginInput);
    valid = false;
  } else {
    clearInvalidField(loginInput); 
  }

  if (!passwordInput.value.trim()) {
    markInvalidField(passwordInput);
    valid = false;
  } else {
    clearInvalidField(passwordInput); 
  }

  if (valid) {
    localStorage.setItem('login', loginInput.value.trim());
    logIn(loginInput.value.trim());
  }
});

buttonAuth.addEventListener('click', () => {
  clearInvalidField(loginInput);
  clearInvalidField(passwordInput);
  loginInput.value = ''; 
  passwordInput.value = ''; 
  openModalAuth();
});

modalAuth.addEventListener('click', (event) => {
  if (event.target === modalAuth) {
    closeModalAuth();
  }
});

closeAuth.addEventListener('click', closeModalAuth);

buttonOut.addEventListener('click', () => {
  logOut();
});

checkAuth();

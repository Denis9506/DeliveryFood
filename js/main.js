const modalAuth = document.querySelector('.modal-auth');
const buttonAuth = document.querySelector('.button-auth');
const buttonOut = document.querySelector('.button-out');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonLogin = document.querySelector('.button-login');

function openModalAuth() {
  modalAuth.classList.add('is-open');
}

function closeModalAuth() {
  modalAuth.classList.remove('is-open');
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

buttonAuth.addEventListener('click', openModalAuth);

buttonOut.addEventListener('click', logOut);

closeAuth.addEventListener('click', closeModalAuth);

logInForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const login = loginInput.value.trim();
  
    if (login === '') {
      loginInput.classList.add('error');  // Add error class for styling
      return;
    }
  
    localStorage.setItem('login', login);
    logIn(login);
    logInForm.reset();
    loginInput.classList.remove('error');  // Remove error class when valid
  });
  
checkAuth();
